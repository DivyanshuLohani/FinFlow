"use server";

import { TTimeFrame } from "@/types/common";

import {
  getCategoryData,
  getMonthlyExpenseVsIncome,
} from "@/lib/transaction/reports";
import { getTotalExpenses, getTotalIncome } from "@/lib/user/analytics";

export async function getReportData(
  timeFrame: TTimeFrame
): Promise<{
  incomeVsExenseData: { name: string; expenses: number; income: number }[];
  categoryData: { name: string; expenses: number; income: number }[];
  totalIncome: number;
  totalExpense: number;
}> {
  const incomeVsExenseData = await getMonthlyExpenseVsIncome();
  const categoryData = await getCategoryData(timeFrame);
  const totalIncome = await getTotalIncome(timeFrame);
  const totalExpense = await getTotalExpenses(timeFrame);

  return {
    incomeVsExenseData,
    categoryData,
    totalIncome,
    totalExpense,
  };
}
