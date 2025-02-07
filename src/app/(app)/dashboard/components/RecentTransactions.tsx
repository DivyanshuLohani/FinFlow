"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TTransaction } from "@/types/transaction";
import Link from "next/link";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import ListTransaction from "./list-transaction";
import { RecentTransactionsSkeleton } from "./RecentTransactionsSkeleton";

const RecentTransactions = forwardRef(({}, ref) => {
  const [recentTransactions, setRecentTransactions] = useState<TTransaction[]>(
    []
  );
  const [isFetching, setIsFetching] = useState(true);

  useImperativeHandle(ref, () => ({
    addTransaction: (transaction: TTransaction) => {
      setRecentTransactions((prev) => [transaction, ...prev]);
    },

    refresh: fetchTransactions,
  }));

  const fetchTransactions = () =>
    fetch("/api/v1/transactions/recent")
      .then((res) => res.json())
      .then((data) => setRecentTransactions(data))
      .finally(() => setIsFetching(false));

  useEffect(() => {
    setIsFetching(true);
    fetchTransactions();
  }, []);

  if (isFetching) return <RecentTransactionsSkeleton />;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction: TTransaction) => (
              <ListTransaction transaction={transaction} key={transaction.id} />
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
              href="/dashboard/transactions"
              className="flex items-center justify-center"
            >
              View All Transactions
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
});

RecentTransactions.displayName = "RecentTransactions";

export default RecentTransactions;
