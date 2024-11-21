import { TableRow, TableCell } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TTransaction } from "@/types/transaction";

import { ArrowUp, ArrowDown } from "lucide-react";
import React from "react";
import { TransactionDialog } from "./TransactionDialog";

interface TransactionRowProps {
  transaction: TTransaction;
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const isMobile = useIsMobile();
  return (
    <TableRow key={transaction.id}>
      <TableCell className="font-medium">
        {transaction.type === "INCOME" ? (
          <span className="flex items-center text-green-600">
            <ArrowUp className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Income</span>
          </span>
        ) : (
          <span className="flex items-center text-red-600">
            <ArrowDown className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Expense</span>
          </span>
        )}
      </TableCell>
      <TableCell>{transaction.category.name}</TableCell>
      <TableCell className="text-right">
        {formatCurrency(transaction.amount)}
      </TableCell>
      <TableCell className="text-right whitespace-nowrap">
        {isMobile
          ? formatDate(transaction.date, "short")
          : formatDate(transaction.date)}
      </TableCell>
      <TableCell className="text-right whitespace-nowrap">
        <TransactionDialog transaction={transaction} />
      </TableCell>
    </TableRow>
  );
}
