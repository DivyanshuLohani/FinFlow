import "server-only";
import { prisma } from "../database/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { TTransaction } from "@/types/transaction";
import { validateInputs } from "../utils/validate";
import { ZId } from "@/types/common";

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

export async function deleteTransaction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  try {
    const deletedTransaction = await prisma.transaction.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });
    return deletedTransaction;
  } catch (error) {
    throw error;
  }
}

export async function getCategories() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return categories;
  } catch (error) {
    throw error;
  }
}

export async function createCategory(name: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  try {
    const category = await prisma.category.create({
      data: {
        name: name,
        userId: session.user.id,
      },
    });
    return category;
  } catch (error) {
    throw error;
  }
}

export async function deleteCategory(id: string) {
  validateInputs([id, ZId]);
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  let othersCategory = await prisma.category.findFirst({
    where: {
      userId: session.user.id,
      special: true,
      name: "Others",
    },
  });
  if (id === othersCategory?.id) {
    throw new Error("Cannot delete 'Others' category");
  }
  if (!othersCategory) {
    othersCategory = await prisma.category.create({
      data: {
        name: "Others",
        special: true,
        userId: session.user.id,
      },
    });
  }

  const category = await prisma.category.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });
  if (!category) {
    throw new Error("Category not found");
  }
  if (category.special) {
    throw new Error("Cannot delete special category");
  }

  try {
    await prisma.transaction.updateMany({
      where: {
        categoryId: id,
        userId: session.user.id,
      },
      data: {
        categoryId: othersCategory.id,
      },
    });
    await prisma.category.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function getTransactions(
  page: number,
  startDate?: Date | string,
  endDate?: Date | string,
  perPage?: number
): Promise<[TTransaction[], number]> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  if (typeof startDate == "string") startDate = new Date(startDate);
  if (typeof endDate == "string") endDate = new Date(endDate);

  const userId = session.user.id;
  const take = perPage || 50;
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
