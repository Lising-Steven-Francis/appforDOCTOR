"use server"

import { z } from 'zod';
import {prisma} from '@/lib/prisma'
import { decrypt } from '@/auth/utils/encryption';

const verificationSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    token: z.string().min(1, 'Token is required'),
    otp: z.number()
        .int('OTP must be a whole number')
        .min(100000, 'OTP must be 6 digits')
        .max(999999, 'OTP must be 6 digits')
});

export type VerificationError = {
    success: false;
    message: string;
    callbackUrl: null;
    errors?: Record<string, string[]>;
};

export type VerificationSuccess = {
    success: true;
    message: string;
    callbackUrl: string | null;
};

export type VerificationResponse = VerificationError | VerificationSuccess;

export async function verifyEmail(email: string) {

    const res = await prisma.verificationToken.findFirst({
        where: {
            identifier: String(email)
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    const result  = {
        success: true,
        message: "",
        callbackUrl: res?.token
    }
    return result
    
} 

export async function checkTokenRequest(email: string, token: string, otp: number): Promise<VerificationResponse> {
    try {
        const decryptedEmail = decrypt(email);
        
        // Validate input using Zod
        const validationResult = verificationSchema.safeParse({
            email: decryptedEmail,
            token,
            otp
        });

        if (!validationResult.success) {
            const errors = validationResult.error.flatten().fieldErrors;
            return {
                success: false,
                message: 'Validation failed',
                callbackUrl: null,
                errors
            };
        }

        const res = await prisma.verificationOTP.findFirst({
            where: {
                token,
                otp: Number(otp),
                verificationtoken: {
                    identifier: decryptedEmail
                }
            },
            select: {
                callbackUrl: true,
                createdAt: true
            }
        });

        if (!res) {
            return {
                success: false,
                message: 'Invalid verification code or token',
                callbackUrl: null
            };
        }

        // Check if OTP is expired (10 minutes validity)
        const OTP_VALIDITY_MINUTES = 10;
        const otpAge = Date.now() - new Date(res.createdAt).getTime();
        if (otpAge > OTP_VALIDITY_MINUTES * 60 * 1000) {
            return {
                success: false,
                message: 'Verification code has expired. Please request a new one',
                callbackUrl: null
            };
        }

        return {
            success: true,
            message: 'Email verified successfully',
            callbackUrl: res.callbackUrl
        };
    } catch (error) {
        console.error('Verification error:', error);
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again',
            callbackUrl: null
        };
    }
}