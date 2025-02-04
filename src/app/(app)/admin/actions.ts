"use server";

import { getAdminData, getUsers } from "@/lib/admin/service";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/database/prisma";
import { createToken } from "@/lib/jwt";
import { getServerSession } from "next-auth";

export async function fetchAdminData() {
  try {
    const adminData = await getAdminData();
    return adminData;
  } catch {
    return {
      totalUsers: 0,
      totalTransactions: 0,
      totalExpense: 0,
      totalIncome: 0,
    };
  }
}

export async function loginAsUser(userId: string, email: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw Error("Not authorized");

  if (!session.user.isAdmin) throw new Error("Not authorized");

  const newToken = createToken(userId, email);

  await prisma.verificationToken.create({
    data: {
      identifier: userId,
      token: newToken,
      expires: new Date(Date.now() + 1000 * 60 * 60),
    },
  });
  return newToken;
}

export async function fetchUsers() {
  try {
    const users = await getUsers();
    return users;
  } catch {
    return [];
  }
}
