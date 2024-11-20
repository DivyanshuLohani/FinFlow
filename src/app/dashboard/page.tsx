import Link from "next/link";
import { PlusIcon, TrendingDown, TrendingUp, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ListTransaction from "./components/list-transaction";
import {
  getRecentTransactions,
  getTotalBalance,
  getTotalExpenses,
  getTotalIncome,
} from "@/lib/user/analytics";
import AddTransactionDialog from "./components/AddIncomeDialog";
import { getCategories } from "@/lib/transaction/service";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const recentTransactions = await getRecentTransactions(5);
  const categories = await getCategories();
  const thisMonth = {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  };
  const lastMonth = {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
  };
  const totalBalance = await getTotalBalance(thisMonth);

  const totalIncome = await getTotalIncome(thisMonth);
  const totalIncomeLastMonth = await getTotalIncome(lastMonth);
  const percentageTotalIncome =
    totalIncomeLastMonth === 0
      ? 0
      : ((totalIncome - totalIncomeLastMonth) / totalIncomeLastMonth) * 100;

  const totalExpenses = await getTotalExpenses(thisMonth);
  const totalExpensesLastMonth = await getTotalExpenses(lastMonth);
  const percentageTotalExpenses =
    totalExpensesLastMonth === 0
      ? 0
      : ((totalExpenses - totalExpensesLastMonth) / totalExpensesLastMonth) *
        100;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBalance)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalIncome)}
            </div>

            <p className="text-xs text-muted-foreground">
              <span
                className={
                  percentageTotalIncome >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {percentageTotalIncome >= 0 ? "+" : "-"}{" "}
                {percentageTotalIncome.toFixed(2)}%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </div>

            <p className="text-xs text-muted-foreground">
              <span
                className={
                  percentageTotalExpenses >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {percentageTotalExpenses >= 0 ? "+ " : "- "}
                {percentageTotalExpenses.toFixed(2)}%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budget.toFixed(2)}</div>
            <Progress value={budgetProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {budgetProgress.toFixed(1)}% of budget used
            </p>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <ListTransaction
                    transaction={transaction}
                    key={transaction.id}
                  />
                ))
              ) : (
                <div>No recent transactions</div>
              )}
            </div>
          </CardContent>
          {recentTransactions.length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Link
                  href="/transactions"
                  className="flex items-center justify-center"
                >
                  View All Transactions
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Add new transactions or view reports
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <AddTransactionDialog categories={categories} type="INCOME" />
            <AddTransactionDialog categories={categories} type="EXPENSE" />
            <Button variant="outline" className="w-full">
              <Link
                href="/reports"
                className="flex items-center justify-center"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
