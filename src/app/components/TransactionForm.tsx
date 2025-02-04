"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionType } from "@prisma/client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "react-toastify";
import { z } from "zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { TTransaction } from "@/types/transaction";
import { useCategories } from "@/hooks/use-category";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence } from "framer-motion";

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
  categoryId: z.string().cuid().min(1, "Category is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  description: z.string().optional(),
  type: z.nativeEnum(TransactionType),
  recurring: z.boolean().optional().default(false),
  recurringType: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .optional()
    .nullable(),
});

interface TransactionFormProps {
  type?: TransactionType;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  transaction?: Partial<TTransaction>;
  editing?: boolean;
}

export default function TransactionForm({
  type,
  onSubmit: onSub,
  transaction,
  editing,
}: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categories } = useCategories();
  if (typeof editing === "undefined") editing = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction?.amount?.toString() || "",
      categoryId: transaction?.categoryId || "",
      date: new Date(transaction?.date || Date.now()),
      description: transaction?.description || "",
      type: transaction?.type || type || TransactionType.INCOME,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      onSub(values);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  const watchRecurring = form.watch("recurring");
  return (
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
              <FormDescription>
                Enter the amount. <br /> You can also use operators like +, -,
                *, /
              </FormDescription>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <br /> You can add categories in the categories tab.
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

        <FormField
          control={form.control}
          name="recurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Recurring Transaction
                </FormLabel>
                <FormDescription>
                  Enable if this is a recurring transaction
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <AnimatePresence>
          {watchRecurring && (
            <FormField
              control={form.control}
              name="recurringType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurring Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How often should this transaction repeat?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </AnimatePresence>
        <Button type="submit" disabled={isSubmitting}>
          {editing ? "Update" : "Add"}
        </Button>
      </form>
    </Form>
  );
}
