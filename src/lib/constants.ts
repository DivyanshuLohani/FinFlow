import "server-only";
export const EMAIL_VERIFICATION_DISABLED =
  process.env.EMAIL_VERIFICATION_DISABLED === "true" ? true : false;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GITHUB_ID = process.env.GITHUB_ID;
export const GITHUB_SECRET = process.env.GITHUB_SECRET;

export const GITHUB_AUTH_ENABLED = GITHUB_ID && GITHUB_SECRET ? true : false;
export const GOOGLE_AUTH_ENABLED =
  GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET ? true : false;
