import { createUser, getUserByEmail } from "@/lib/user/service";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return new Response(JSON.stringify({ error: "Missing idToken" }), {
        status: 400,
      });
    }

    // 1. Verify ID Token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }

    const { email, picture, name } = payload;
    let existingUserWithEmail = await getUserByEmail(email!);
    if (!existingUserWithEmail) {
      existingUserWithEmail = await createUser({
        name:
          name ||
          email!
            .split("@")[0]
            .replace(/[^'\p{L}\p{M}\s\d-]+/gu, " ")
            .trim(),
        email: email!,
        image: picture!,
        password: null,
        emailVerified: new Date(Date.now()),
      });
    }

    // 4. Create JWT token for mobile auth
    const token = jwt.sign(
      { userId: existingUserWithEmail.id },
      process.env.JWT_SECRET!,
      { expiresIn: "365d" }
    );

    return new Response(
      JSON.stringify({
        user: {
          id: existingUserWithEmail.id,
          email: existingUserWithEmail.email,
          name: existingUserWithEmail.name,
          image: existingUserWithEmail.image,
        },
        token,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Authentication failed" }), {
      status: 500,
    });
  }
}

export function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
