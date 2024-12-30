import MagicLinkEmail from "@/emails/magic-link-email";
import { EmailConfig } from "next-auth/providers/email";
import { Resend } from "resend";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

import { getUserByEmail } from "./user";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationRequest: EmailConfig["sendVerificationRequest"] =
  async ({ identifier, url, provider }) => {
    const user = await getUserByEmail(identifier);
    const isExistingUser = !!user;
    const authSubject = isExistingUser
      ? `Sign-in link for ${siteConfig.name}`
      : "Activate your account - Welcome to Entretien AI";

    try {
      const { data, error } = await resend.emails.send({
        from: provider.from ?? `noreply@${siteConfig.url}`,
        to: identifier,
        subject: authSubject,
        react: MagicLinkEmail({
          firstName: user?.name || "there",
          actionUrl: url,
          mailType: isExistingUser ? "login" : "register",
          siteName: siteConfig.name,
        }),
        // Set this to prevent Gmail from threading emails.
        // More info: https://resend.com/changelog/custom-email-headers
        headers: {
          "X-Entity-Ref-ID": new Date().getTime() + "",
        },
      });

      console.log("Email attempt details:", {
        to: identifier,
        from: provider.from ?? `noreply@${siteConfig.url}`,
        subject: authSubject,
        isExistingUser,
        hasError: !!error,
        errorDetails: error,
        responseData: data,
      });

      if (error || !data) {
        console.error("Resend API error details:", error);
        throw new Error(error?.message || "Unknown email error");
      }
    } catch (error) {
      console.error("Full email error details:", error);
      throw error;
    }
  };
