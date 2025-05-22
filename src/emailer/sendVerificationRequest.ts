import type { SentMessageInfo } from "nodemailer";
import type { PrismaClient } from "@prisma/client";
import type { EmailConfig } from "next-auth/providers/email";

import { prisma } from "@/lib/prisma";
import { createTransport } from "nodemailer";
import { html, text } from "@/emailer/emailTemplates";

// Type for email theme (optional customization)
type EmailTheme = {
  brandColor?: string;
  buttonText?: string;
};

// Utility constant for 5-minute expiration
const FIVE_MINUTES = new Date(Date.now() + Number(process.env.EMAIL_TOKEN_EXPIRES_MINUTES) * 60 * 1000);

/**
 * Sends a magic link and OTP to the user via email.
 * Stores OTP separately in the verificationOTP table.
 */
export async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  expires: Date;
  provider: EmailConfig;
  token: string;
  theme: EmailTheme;
  request: Request;
}): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { identifier, url, provider, token, theme } = params;
  const { host } = new URL(url);

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Modify the callback URL to redirect to /dashboard
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set("callbackUrl", `${process.env.AUTH_URL}/dashboard`);
  const modifiedUrl = parsedUrl.toString();

  // Create the email transport
  const transport = createTransport(provider.server);

  // Send the email with the magic link and OTP
  const result: SentMessageInfo = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in verification for ${host}`,
    text: text({ url: modifiedUrl, host, otp }),
    html: html({ url: modifiedUrl, host, theme, otp }),
    
  });

  // Handle failures in email sending
  const failedRecipients = [...(result.rejected || []), ...(result.pending || [])];
  if (failedRecipients.length > 0) {
    throw new Error(`Email(s) (${failedRecipients.join(", ")}) could not be sent`);
  }

  // Store OTP in the database
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [verificationToken, verificationOTP] = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
    const verificationTokenRecord = await tx.verificationToken.findFirst({
      where: { identifier },
      orderBy: { createdAt: "desc" },
    });

    if (!verificationTokenRecord) throw new Error("Verification token not found");

    //delete unused requests
    await tx.verificationToken.deleteMany({
      where: { 
        identifier, 
        NOT: {
          token: verificationTokenRecord.token
        }
       }
    })

    const otpEntry = await tx.verificationOTP.create({
      data: {
        token: String(verificationTokenRecord.token),
        otp: Number(otp),
        expires: FIVE_MINUTES,
        callbackUrl: modifiedUrl,
      },
    });

    return [verificationTokenRecord, otpEntry];
  });
}
