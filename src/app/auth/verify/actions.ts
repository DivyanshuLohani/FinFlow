"use server";

import { generateVerificationToken } from "@/lib/user/service";

export async function resendVerificationEmail(email: string) {
  const success = !!(await generateVerificationToken(email));
  return success;
}
