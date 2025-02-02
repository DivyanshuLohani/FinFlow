import { Resend } from "resend";
import { RESEND_API_KEY } from "../constants";
import { EmailVerification } from "../../../emails/VerificationEmail";

const resend = new Resend(RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
) {
  try {
    await resend.emails.send({
      from: "FinFlow <team@divyanshulohani.xyz>",
      to: email,
      subject: "Verify your email address",
      react: EmailVerification({ name, token }),
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

// export async function sendPasswordResetEmail(email: string, token: string) {
//   try {
//     await resend.emails.send({
//       from: "FinFlow <onboarding@resend.dev>",
//       to: email,
//       subject: "Reset your password",
//       html: `<h1>Reset your password</h1>
//       <p>Please click the link below to reset your password:</p>
//       <a href="${process.env.NEXTAUTH_URL}/api/auth/reset-password?token=${token}">Reset Password</a>`,
//     });
//   } catch (error) {
//     console.error("Error sending password reset email:", error);
//     throw error;
//   }
// }
