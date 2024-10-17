import type NextAuthConfig from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Resend from "next-auth/providers/resend"

import { env } from "@/env.mjs";
import { sendVerificationRequest } from "@/lib/email";

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
      // sendVerificationRequest,
    }),
  ],
} satisfies NextAuthConfig;
