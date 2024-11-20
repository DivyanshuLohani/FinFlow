import { authOptions } from "@/lib/auth/authOptions";
import { EMAIL_VERIFICATION_DISABLED } from "@/lib/constants";
import { createUser, updateUser } from "@/lib/user/service";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

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

    return Response.json(user);
  } catch (e: any) {
    console.log(e);
    if (e.message === "User with this email already exists") {
      return Response.json(
        {
          error: "User with this email already exists",
          errorCode: e.code,
        },
        { status: e.statusCode }
      );
    } else {
      return Response.json(
        {
          error: e.message,
          errorCode: e.code,
        },
        { status: 500 }
      );
    }
  }
};

export const PATCH = async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  // TODO: Remove when middleware is addded
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await request.json();

  try {
    const updatedUser = await updateUser(session.user.id, user);
    return Response.json(updatedUser);
  } catch (e: any) {
    console.log(e);
    return Response.json(
      {
        error: e.message,
        errorCode: e.code,
      },
      { status: 500 }
    );
  }
};
