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
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ListTransaction from "./list-transaction";
import { RecentTransactionsSkeleton } from "./RecentTransactionsSkeleton";

export default function RecentTransactions() {
  const [recentTransactions, setRecentTransactions] = useState<TTransaction[]>(
    []
  );
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    fetch("/api/v1/transactions/recent")
      .then((res) => res.json())
      .then((data) => setRecentTransactions(data))
      .catch((err) => console.log(err))
      .finally(() => setIsFetching(false));
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
}
