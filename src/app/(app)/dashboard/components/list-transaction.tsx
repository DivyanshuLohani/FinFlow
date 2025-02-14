import { TransactionType } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import clsx from "clsx";
import { TTransaction } from "@/types/transaction";
import { TransactionDialog } from "../transactions/components/TransactionDialog";
import { useRef } from "react";

interface ListTransactionProps {
  transaction: TTransaction;
  setTransactions?: React.Dispatch<React.SetStateAction<TTransaction[]>>;
}

export default function ListTransaction({
  transaction,
  setTransactions,
}: ListTransactionProps) {
  const dialogRef = useRef<{ openDialog: () => void; closeDialog: () => void }>(
    null
  );
  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={dialogRef.current?.openDialog}
    >
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
        <TransactionDialog
          ref={dialogRef}
          className="hidden"
          transaction={transaction}
          setTransactions={setTransactions}
        />
      </div>
    </div>
  );
}
