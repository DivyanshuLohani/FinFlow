"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  TagIcon,
  Banknote,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TTransaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { formatCurrency } from "@/lib/utils";

interface TransactionDialogProps {
  transaction: TTransaction;
}

export function TransactionDialog({ transaction }: TransactionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>More details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Detailed information about this transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div
              className={clsx(
                "rounded-full p-2",
                transaction.type === "INCOME" ? "bg-green-500" : "bg-red-500"
              )}
            >
              {transaction.type === "INCOME" ? (
                <ArrowUpIcon className="h-6 w-6 text-white" />
              ) : (
                <ArrowDownIcon className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{transaction.category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {transaction.type.charAt(0).toUpperCase() +
                  transaction.type.slice(1)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <Banknote className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Amount</p>
              <p
                className={`text-sm ${
                  transaction.type === "INCOME"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Date</p>
              <p className="text-sm text-muted-foreground">
                {format(transaction.date, "MMMM d, yyyy")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <TagIcon className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Category</p>
              <Badge variant="secondary">{transaction.category.name}</Badge>
            </div>
          </div>
          {transaction.description && (
            <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Description</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
