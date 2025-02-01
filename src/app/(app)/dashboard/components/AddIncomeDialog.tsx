"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  PlusIcon,
} from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType, type Category } from "@prisma/client";

import { toast } from "react-toastify";
import { createTransaction } from "@/lib/transaction";

interface AddTransactionDialogProps {
  categories: Category[];
  type?: TransactionType;
  compact?: boolean;
}

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => /^[0-9+\-*/.\s]+$/.test(val), {
      message: "Amount must contain only numbers and +, -, *, / operators",
    })
    .refine(
      (val) => {
        try {
          // Evaluate the expression safely
          // eslint-disable-next-line no-eval
          return !isNaN(eval(val));
        } catch {
          return false;
        }
      },
      { message: "Amount must be a valid mathematical expression" }
    ),
  categoryId: z.string().min(1, "Category is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  description: z.string().optional(),
  type: z.nativeEnum(TransactionType),
});

export default function AddIncomeDialog({
  categories,
  type,
  compact,
}: AddTransactionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      categoryId: "",
      date: new Date(),
      description: "",
      type: type || TransactionType.INCOME,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      await createTransaction({ ...values });
      toast.success("Transaction added successfully");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);

      setOpen(false);
    }
  }

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
      <DialogContent>
        <DialogTitle>
          Add {type === TransactionType.INCOME ? "Income" : "Expense"}
        </DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {!type && (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TransactionType.INCOME}>
                          Income
                        </SelectItem>
                        <SelectItem value={TransactionType.EXPENSE}>
                          Expense
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Transaction Type</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="0.00"
                        {...field}
                        onBlur={(e) => {
                          const value = e.target.value;
                          try {
                            // Evaluate the expression safely
                            // eslint-disable-next-line no-eval
                            const evaluatedValue = eval(value);
                            if (!isNaN(evaluatedValue)) {
                              field.onChange(evaluatedValue.toString());
                            }
                          } catch {
                            // Handle invalid input gracefully
                            field.onChange("");
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Enter the amount.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the category of{" "}
                    {type === TransactionType.INCOME ? "income" : "expense"}.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The date when the income was received.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional details..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Add any additional notes about this transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Adding..."
                : type === TransactionType.INCOME
                  ? "Add Income"
                  : "Add Expense"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
