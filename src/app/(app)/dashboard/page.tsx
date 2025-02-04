"use client";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentTransactions ref={recentTransactionsRef} />
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Add new transactions or view reports
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <AddTransactionDialog type="INCOME" onAdd={onAdd} />
            <AddTransactionDialog type="EXPENSE" onAdd={onAdd} />
            <Button variant="outline" className="w-full">
              <Link
                href="/dashboard/reports"
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
