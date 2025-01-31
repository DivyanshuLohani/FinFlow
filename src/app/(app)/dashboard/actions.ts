"use server";

import { getTotalExpenses as getTotalExpensesServer } from "@/lib/user/analytics";
import { TTimeFrame } from "@/types/common";
import { getTotalIncome as getTotalIncomeServer } from "@/lib/user/analytics";

export async function getTotalExpenses(timeFrame: TTimeFrame) {
  const totalExpenses = await getTotalExpensesServer(timeFrame);
  return totalExpenses;
}

// Similarly for income
export async function getTotalIncome(timeFrame: TTimeFrame) {
  const totalIncome = await getTotalIncomeServer(timeFrame);
  return totalIncome;
}
