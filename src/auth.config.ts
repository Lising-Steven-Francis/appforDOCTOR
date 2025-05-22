
import type { NextAuthConfig } from "next-auth";

import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Linkedin from "next-auth/providers/linkedin";
import Nodemailer from "next-auth/providers/nodemailer";
import { sendVerificationRequest } from "@/emailer/sendVerificationRequest";


const secure = Number(process.env.EMAIL_SERVER_PORT) === 465 
export const authConfig: NextAuthConfig = {
  providers: [
    Google,
    GitHub,
    Linkedin,
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT) || 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
        tls: {
          rejectUnauthorized: false,
        },
       secure,// secure: true, // Must be true for port 465
      },
      from: process.env.EMAIL_FROM as string,
      maxAge: 15 * 60, // 15 minutes magic link
      sendVerificationRequest,
    }),
  ],
  pages: {
    // signIn: "/login",         // Custom login page
    // error: "/login",          // Redirect errors to login (you can handle query param ?error=)
    // verifyRequest: "/verify", // Optional: After magic link sent
    // signOut: "/logout",       // Optional: Custom sign-out page
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
} satisfies NextAuthConfig;
