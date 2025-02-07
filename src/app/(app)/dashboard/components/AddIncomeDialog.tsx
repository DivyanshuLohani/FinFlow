"use client";

import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TransactionType } from "@prisma/client";
import TransactionForm from "@/app/components/TransactionForm";
import { createTransaction } from "@/lib/transaction";
import { toast } from "react-toastify";
import { TTransaction } from "@/types/transaction";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddTransactionSheetProps {
  type?: TransactionType;
  compact?: boolean;
  onAdd?: (transaction: TTransaction) => void;
}

export default function AddTransactionSheet({
  type,
  compact,
  onAdd,
}: AddTransactionSheetProps) {
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

  const isMobile = useIsMobile();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {compact ? (
          <Button className="w-16 h-16 rounded-full fixed bottom-4 right-4 z-10 shadow-lg">
            <PlusIcon className="w-8 h-8" />
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
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="h-[90vh] sm:h-full overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">
            Add {type === TransactionType.INCOME ? "Income" : "Expense"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Add Income Dialog
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <TransactionForm
            initialValues={{
              type: type,
              recurring: false,
              amount: "",
            }}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
