import "server-only";
import { prisma } from "../database/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import {
  TTransaction,
  TTransactionUpdate,
  ZTransactionUpdate,
} from "@/types/transaction";
import { validateInputs } from "../utils/validate";
import { ZId } from "@/types/common";

export async function createTransaction(data: any) {
  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        ...data,
      },
      include: { category: true },
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

export async function updateTransaction(id: string, data: TTransactionUpdate) {
  validateInputs([data, ZTransactionUpdate]);

  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  try {
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        ...data,
      },
      include: { category: true },
    });
    return updatedTransaction;
  } catch (error) {
    throw error;
  }
}

export async function updateRecurringTransactions() {
  const recurringTransactions = await prisma.transaction.findMany({
    where: {
      recurring: true,
      nextDate: {
        lte: new Date(),
      },
    },
    include: { category: true },
  });

  for (const transaction of recurringTransactions) {
    const newDate = new Date(transaction.nextDate ?? transaction.date);
    let nextDate: Date;
    let lastDayOfMonth, day;
    switch (transaction.recurringType) {
      case "DAILY":
        // handle for last day of the month
        lastDayOfMonth = new Date(
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          0
        ).getDate();
        day = newDate.getDate();
        if (day === lastDayOfMonth) {
          nextDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
        } else {
          nextDate = new Date(newDate.setDate(newDate.getDate() + 1));
        }
        break;
      case "WEEKLY":
        // handle for last dates of the month
        lastDayOfMonth = new Date(
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          0
        ).getDate();
        day = newDate.getDate();
        const diff = 7 - (day % 7);
        const newDay = day + diff;
        if (newDay > lastDayOfMonth) {
          nextDate = new Date(
            newDate.getFullYear(),
            newDate.getMonth() + 1,
            newDay - lastDayOfMonth
          );
        } else {
          nextDate = new Date(newDate.setDate(newDate.getDate() + diff));
        }
        break;
      case "MONTHLY":
        // handle for last month of the year
        nextDate = new Date(newDate.setMonth(newDate.getMonth() + 1));
        if (nextDate.getMonth() === 0) {
          nextDate.setFullYear(nextDate.getFullYear() + 1);
        }
        break;
      case "YEARLY":
        nextDate = new Date(newDate.setFullYear(newDate.getFullYear() + 1));
        break;
      default:
        nextDate = new Date();
    }
    await prisma.transaction.create({
      data: {
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        date: nextDate,
        userId: transaction.userId,
        categoryId: transaction.categoryId,
        recurring: false,
      },
    });
    await prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        nextDate: nextDate,
      },
    });
  }
}
