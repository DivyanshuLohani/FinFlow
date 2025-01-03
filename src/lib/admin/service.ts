import { getServerSession } from "next-auth";
import "server-only";
import { prisma } from "../database/prisma";
import { authOptions } from "../auth/authOptions";
import jwt from "jsonwebtoken";
import { createToken } from "../jwt";

export async function getAdminData() {
  const session = await getServerSession(authOptions);
  if (!session) throw Error("Not authorized");

  if (!session.user.isAdmin) throw new Error("Not authorized");

  const [totalTransactions, totalExpense, totalIncome, totalUsers] =
    await prisma.$transaction([
      prisma.transaction.count(),
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: "EXPENSE",
        },
      }),
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: "INCOME",
        },
      }),
      prisma.user.count(),
    ]);

  return {
    totalTransactions,
    totalExpense: totalExpense._sum.amount || 0,
    totalIncome: totalIncome._sum.amount || 0,
    totalUsers,
  };
}

export async function getUsers() {
  const session = await getServerSession(authOptions);
  if (!session) throw Error("Not authorized");

  if (!session.user.isAdmin) throw new Error("Not authorized");
  // For every user generate a token and add it to the list

  const users = await prisma.user.findMany();
  const usersWithTokens = await Promise.all(
    users.map(async (user) => {
      const token = createToken(user.id, user.email);
      return { ...user, token };
    })
  );
  return usersWithTokens;
}
