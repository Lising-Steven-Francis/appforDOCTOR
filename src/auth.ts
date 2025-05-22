import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";


const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), // Use PrismaAdapter for database integration
  session: { 
    strategy: "database",  // Ensures session persistence in the database
    // maxAge: 15 * 60,   // 15 minutes in seconds
    // updateAge: 5 * 60, // refresh token if 5+ minutes passed
  },
  ...authConfig,
});
