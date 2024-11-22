import "server-only";
import { getTransactions } from "./service";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { TTimeFrame } from "@/types/common";
import { getTimeFrame } from "../utils/time";
import { TransactionType } from "@prisma/client";

export async function getMonthlyExpenseVsIncome(months: number = 5) {
  const currentDate = new Date();
  const transactions = [];
  for (let i = 0; i < months; i++) {
    const month = currentDate.getMonth() - i;
    const year = currentDate.getFullYear() - (month < 0 ? 1 : 0);
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const monthTransactions = await getTransactions(1, firstDay, lastDay);

    transactions.push({
      name: firstDay.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      expenses: monthTransactions[0].reduce((sum, transaction) => {
        return sum + (transaction.type === "EXPENSE" ? transaction.amount : 0);
      }, 0),
      income: monthTransactions[0].reduce((sum, transaction) => {
        return sum + (transaction.type === "INCOME" ? transaction.amount : 0);
      }, 0),
    });
  }
  return transactions.reverse();
}

export async function getCategoryData(timeFrame?: TTimeFrame) {
  if (!timeFrame) timeFrame = getTimeFrame("month");

  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  const { startDate, endDate } = timeFrame;
  const transactions = await getTransactions(1, startDate, endDate);
  const categories: {
    [key: string]: { name: string; expenses: number; income: number };
  } = {};
  transactions[0].forEach((transaction) => {
    const { category, amount, type } = transaction;
    if (!categories[category.name]) {
      categories[category.name] = {
        name: category.name,
        expenses: 0,
        income: 0,
      };
    }
    if (type === TransactionType.EXPENSE) {
      categories[category.name].expenses += amount;
    } else {
      categories[category.name].income += amount;
    }
  });
  return Object.values(categories);
}
