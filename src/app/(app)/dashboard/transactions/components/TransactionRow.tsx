"use client";
import { TableRow, TableCell } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TTransaction } from "@/types/transaction";

import { ArrowUp, ArrowDown } from "lucide-react";
import React, { useRef } from "react";
import { TransactionDialog } from "./TransactionDialog";

interface TransactionRowProps {
  transaction: TTransaction;
  setTransactions: React.Dispatch<React.SetStateAction<TTransaction[]>>;
}

export default function TransactionRow({
  transaction,
  setTransactions,
}: TransactionRowProps) {
  const dialogRef = useRef<{ openDialog: () => void; closeDialog: () => void }>(
    null
  );
  const isMobile = useIsMobile();
  return (
    <TableRow
      key={transaction.id}
      onClick={() => dialogRef.current?.openDialog()}
    >
      <TableCell>{transaction.category.name}</TableCell>
      <TableCell className="text-right">
        {transaction.type === "INCOME" ? (
          <span className="flex items-center text-green-600">
            <ArrowUp className="mr-1 h-4 w-4 hidden sm:inline" />
            <span className="">+{formatCurrency(transaction.amount)}</span>
          </span>
        ) : (
          <span className="flex items-center text-red-600">
            <ArrowDown className="mr-1 h-4 w-4 hidden sm:inline" />
            <span className="">{formatCurrency(-1 * transaction.amount)}</span>
          </span>
        )}
      </TableCell>
      <TableCell className="text-right whitespace-nowrap">
        {isMobile
          ? formatDate(transaction.date, "short")
          : formatDate(transaction.date)}
      </TableCell>
      <TableCell className="text-right whitespace-nowrap hidden sm:block">
        <TransactionDialog
          ref={dialogRef}
          transaction={transaction}
          setTransactions={setTransactions}
        />
      </TableCell>
    </TableRow>
  );
}
