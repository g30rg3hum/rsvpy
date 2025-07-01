import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../prisma/prisma";
import sendVerificationRequest from "./send-verification-request";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT as string, 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/error?verification_failure=true",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false; // Prevent sign-in if email is not provided
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (existingUser) {
        return true;
      } else {
        return false;
      }
    },
  },
};

export default authOptions;
