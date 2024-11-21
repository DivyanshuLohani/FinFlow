import "server-only";
import { getTransactions } from "./service";

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
      month: firstDay.toLocaleString("default", {
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
  return transactions;
}
