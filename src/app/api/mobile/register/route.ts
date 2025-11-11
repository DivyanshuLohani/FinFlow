import { EMAIL_VERIFICATION_DISABLED } from "@/lib/constants";
import { createUser } from "@/lib/user/service";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (request: NextRequest) => {
  let user = await request.json();

  try {
    user = {
      ...user,
      email: user.email.toLowerCase(),
    };

    user = await createUser(user);
    if (!EMAIL_VERIFICATION_DISABLED) {
      // TODO: Send Verification Email
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "365d",
    });

    return Response.json({ user, token });
  } catch (e: any) {
    if (e.message === "User with this email already exists") {
      return Response.json(
        {
          error: "User with this email already exists",
          errorCode: e.code,
        },
        { status: e.statusCode }
      );
    }
    return Response.json(
      {
        error: e.message,
        errorCode: e.code,
      },
      { status: 500 }
    );
  }
};
