"use client";

import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@prisma/client";
import TransactionForm from "@/app/components/TransactionForm";
import { createTransaction } from "@/lib/transaction";
import { toast } from "react-toastify";
import { TTransaction } from "@/types/transaction";

interface AddTransactionDialogProps {
  type?: TransactionType;
  compact?: boolean;
  onAdd?: (transaction: TTransaction) => void;
}

export default function AddIncomeDialog({
  type,
  compact,
  onAdd,
}: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      const transaction = await createTransaction({ ...values });
      if (onAdd) onAdd(transaction);
      toast.success("Transaction added successfully");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <Button className="w-16 h-16 rounded-full">
            <PlusIcon height={50} width={50} className="w-full h-full" />
          </Button>
        ) : (
          <Button className="w-full">
            {type === TransactionType.INCOME ? (
              <ArrowUpIcon className="mr-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="mr-2 h-4 w-4" />
            )}
            Add {type === TransactionType.INCOME ? "Income" : "Expense"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={"overflow-y-scroll max-h-screen"}>
        <DialogTitle>
          Add {type === TransactionType.INCOME ? "Income" : "Expense"}
        </DialogTitle>

        <TransactionForm
          type={type}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
