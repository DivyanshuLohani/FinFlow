"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddTransactionDialog from "./components/AddIncomeDialog";
import RecentTransactions from "./components/RecentTransactions";
import TransactionMetrics, {
  TransactionMatricsElement,
} from "./components/TransactionMetrics";
import { useRef } from "react";
import { TTransaction } from "@/types/transaction";
import SpendingByCategoryChart from "./components/SpendingByCategoryChart";
import IncomeExpenseChart from "./components/IncomeExpenseChart";
import SpendingList from "./components/SpendingList";

export default function DashboardPage() {
  const transactionMatricsRef = useRef<TransactionMatricsElement>(null);
  const recentTransactionsRef = useRef<{
    addTransaction: (transaction: any) => void;
  }>(null);

  const onAdd = (transaction: TTransaction) => {
    transactionMatricsRef.current?.addTransaction(transaction);
    recentTransactionsRef.current?.addTransaction(transaction);
  };

  return (
    <div className="space-y-6">
      <TransactionMetrics ref={transactionMatricsRef} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Income vs. Expenses</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingByCategoryChart />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
            <CardDescription>Current month&apos;s expense categories</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingList />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RecentTransactions ref={recentTransactionsRef} />
        </div>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <AddTransactionDialog type="INCOME" onAdd={onAdd} />
            <AddTransactionDialog type="EXPENSE" onAdd={onAdd} />
            <Button variant="outline" className="w-full as-child">
              <Link
                href="/dashboard/reports"
                className="flex items-center justify-center"
              >
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>̥
    </div>
  );
}
