// lib/requireAuth.ts
import jwt from "jsonwebtoken";

export async function requireAuth(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return { userId: (decoded as any).userId };
  }

  throw new Error("Unauthorized");
}
