import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "./database/prisma";

export const createToken = (
  userId: string,
  userEmail: string,
  options = {}
): string => {
  return jwt.sign({ id: userId }, process.env.NEXTAUTH_SECRET + userEmail, {
    expiresIn: "15d",
    ...options,
  });
};

export const verifyToken = async (
  token: string,
  userEmail: string = ""
): Promise<JwtPayload> => {
  if (!token) {
    throw new Error("No token found");
  }
  const decoded = jwt.decode(token);
  const payload: JwtPayload = decoded as JwtPayload;
  const { id } = payload;

  if (!userEmail) {
    const foundUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!foundUser) {
      throw new Error("User not found");
    }

    userEmail = foundUser.email;
  }

  return jwt.verify(
    token,
    process.env.NEXTAUTH_SECRET + userEmail
  ) as JwtPayload;
};

export const verifyInviteToken = (
  token: string
): { inviteId: string; email: string } => {
  try {
    const decoded = jwt.decode(token);
    const payload: JwtPayload = decoded as JwtPayload;

    const { inviteId, email } = payload;

    return {
      inviteId,
      email,
    };
  } catch (error) {
    console.error(`Error verifying invite token: ${error}`);
    throw new Error("Invalid or expired invite token");
  }
};
