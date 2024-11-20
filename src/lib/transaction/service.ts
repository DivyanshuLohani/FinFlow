import "server-only";
import { prisma } from "../database/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";

export async function createTransaction(data: any) {
  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        ...data,
      },
    });
    return newTransaction;
  } catch (error) {
    throw error;
  }
}

export async function getCategories() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    throw error;
  }
}

export async function getTransactions(
  page: number,
  startDate?: Date,
  endDate?: Date,
  perPage?: number
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;
  const take = perPage || 10;
  const skip = (page - 1) * take;

  try {
    const [transactions, count] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: {
          userId,
          ...(startDate && endDate
            ? {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              }
            : {}),
        },
        include: { category: true },
        take,
        skip,
        orderBy: { date: "desc" },
      }),
      prisma.transaction.count({
        where: {
          userId,
          ...(startDate && endDate
            ? {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              }
            : {}),
        },
      }),
    ]);

    return [transactions, count];
  } catch (error) {
    throw error;
  }
}
