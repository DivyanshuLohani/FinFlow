import "server-only";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/authOptions";
import { prisma } from "../database/prisma";

// Helper schema for timeFrame
const ZTimeFrame = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export async function getUserIdFromSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated or session invalid");
  }

  return session.user.id;
}

export async function getTotalBalance() {
  const userId = await getUserIdFromSession();

  const [income, expenses] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        type: "INCOME",
        userId,
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        type: "EXPENSE",
        userId,
      },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = income._sum.amount || 0;
  const totalExpenses = expenses._sum.amount || 0;

  return totalIncome - totalExpenses;
}

export async function getTotalIncome(timeFrame: {
  startDate: Date;
  endDate: Date;
}) {
  const userId = await getUserIdFromSession();
  const { startDate, endDate } = ZTimeFrame.parse(timeFrame);

  const income = await prisma.transaction.aggregate({
    where: {
      type: "INCOME",
      date: { gte: startDate, lte: endDate },
      userId,
    },
    _sum: { amount: true },
  });

  return income._sum.amount || 0;
}

export async function getTotalExpenses(timeFrame: {
  startDate: Date;
  endDate: Date;
}) {
  const userId = await getUserIdFromSession();
  const { startDate, endDate } = ZTimeFrame.parse(timeFrame);

  const expenses = await prisma.transaction.aggregate({
    where: {
      type: "EXPENSE",
      date: { gte: startDate, lte: endDate },
      userId,
    },
    _sum: { amount: true },
  });

  return expenses._sum.amount || 0;
}

export async function getBudgets(timeFrame: {
  startDate: Date;
  endDate: Date;
}) {
  const userId = await getUserIdFromSession();
  const { startDate, endDate } = ZTimeFrame.parse(timeFrame);

  const budgets = await prisma.budget.findMany({
    where: {
      OR: [
        { startDate: { lte: endDate }, endDate: { gte: startDate }, userId },
        { startDate: { gte: startDate, lte: endDate }, userId },
      ],
    },
    include: { category: true },
  });

  return budgets;
}

export async function getRecentTransactions(limit: number = 5) {
  const userId = await getUserIdFromSession();

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
    include: { category: true },
  });

  return transactions;
}

export async function getSpendingByCategory(timeFrame: {
  startDate: Date;
  endDate: Date;
}) {
  const userId = await getUserIdFromSession();
  const { startDate, endDate } = ZTimeFrame.parse(timeFrame);

  const spending = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      type: "EXPENSE",
      date: { gte: startDate, lte: endDate },
    },
    _sum: {
      amount: true,
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      id: { in: spending.map((s) => s.categoryId) },
    },
  });

  return spending.map((s) => ({
    ...s,
    category: categories.find((c) => c.id === s.categoryId),
  }));
}

export async function getIncomeExpenseTrend(timeFrame: {
  startDate: Date;
  endDate: Date;
}) {
  const userId = await getUserIdFromSession();
  const { startDate, endDate } = ZTimeFrame.parse(timeFrame);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
    select: {
      date: true,
      type: true,
      amount: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const trend = transactions.reduce(
    (acc, transaction) => {
      const month = transaction.date.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }
      return acc;
    },
    {} as Record<string, { month: string; income: number; expenses: number }>
  );

  return Object.values(trend);
}
