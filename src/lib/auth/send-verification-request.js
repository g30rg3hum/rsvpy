import LoginEmail from "@/components/emails/login";
import { resend } from "../resend/resend";

// custom email design
export default async function sendVerificationRequest(params) {
  const { identifier, url, provider } = params;

  try {
    await resend.emails.send({
      from: provider.from,
      to: identifier,
      subject: "Login to rsvpy",
      react: LoginEmail({ url }),
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}
