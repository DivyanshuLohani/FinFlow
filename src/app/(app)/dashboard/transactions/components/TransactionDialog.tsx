"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  TagIcon,
  Banknote,
  StickyNote,
  Trash,
  Edit,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TTransaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { formatCurrency } from "@/lib/utils";
import { deleteTransaction, updateTransaction } from "@/lib/transaction";
import { toast } from "react-toastify";
import TransactionForm from "@/app/components/TransactionForm";

interface TransactionDialogProps {
  transaction: TTransaction;
  setTransactions: React.Dispatch<React.SetStateAction<TTransaction[]>>;
}

export const TransactionDialog = forwardRef(
  ({ transaction, setTransactions }: TransactionDialogProps, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    useImperativeHandle(ref, () => ({
      openDialog: () => {
        if (!isOpen) setIsOpen(true);
      },
      closeDialog: () => {
        if (isOpen) setIsOpen(false);
      },
    }));

    useEffect(() => {
      if (!isOpen) setEditing(false);
    }, [isOpen]);

    const handleDelete = async () => {
      setLoading(true);
      try {
        await deleteTransaction(transaction.id);
        setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
      } catch {
        toast.error("Something went wrong");
      }
      setLoading(false);
    };

    const handleUpdate = async (values: any) => {
      try {
        const updated = await updateTransaction(transaction.id, values);
        setTransactions((prev) =>
          prev.map((t) => (t.id === transaction.id ? { ...updated } : t))
        );
        toast.success("Transaction updated successfully");
        setEditing(false);
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>More details</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information about this transaction.
            </DialogDescription>
          </DialogHeader>
          {!editing ? (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div
                  className={clsx(
                    "rounded-full p-2",
                    transaction.type === "INCOME"
                      ? "bg-green-500"
                      : "bg-red-500"
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
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Description
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <TransactionForm
              transaction={transaction}
              onSubmit={handleUpdate}
              editing
              type={transaction.type}
            />
          )}
          <DialogFooter>
            {!editing && (
              <>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setEditing(true)}
                  disabled={loading}
                >
                  <Edit className="ml-1 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash className="ml-1 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

TransactionDialog.displayName = "TransactionDialog";
