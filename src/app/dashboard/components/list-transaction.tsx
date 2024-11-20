import React from "react";
import { TransactionType, type Transaction } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import clsx from "clsx";

interface ListTransactionProps {
  transaction: Transaction & {
    category: {
      name: string;
    };
  };
}

export default function ListTransaction({ transaction }: ListTransactionProps) {
  return (
    <div key={transaction.id} className="flex items-center">
      <div
        className={`rounded-full p-2 ${
          transaction.type === TransactionType.INCOME
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      >
        {transaction.type === TransactionType.INCOME ? (
          <ArrowUpIcon className="h-4 w-4 text-white" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 text-white" />
        )}
      </div>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">
          {transaction.category.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDate(transaction.date)}
        </p>
      </div>
      <div
        className={clsx("ml-auto font-medium", {
          "text-green-500": transaction.type === TransactionType.INCOME,
          "text-red-500": transaction.type === TransactionType.EXPENSE,
        })}
      >
        {transaction.type === TransactionType.INCOME ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </div>
    </div>
  );
}
