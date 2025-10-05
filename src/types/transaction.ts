import { type Category } from "@prisma/client";
import { z } from "zod";
// Category Schema
export const ZCategory = z.object({
  id: z.string().cuid(),
  name: z.string(),
  color: z.string(),
  userId: z.string().cuid(),
  special: z.boolean().default(false),
});

export const ZTransaction = z.object({
  id: z.string().cuid(),
  amount: z.number(),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().nullable(),
  date: z.date().default(() => new Date()),
  userId: z.string().cuid(),
  categoryId: z.string().cuid(),
  category: ZCategory,

  recurring: z.boolean().optional().default(false),
  isAddedByRecurring: z.boolean().optional().default(false),
  nextDate: z.date().optional().nullable(),
  recurringType: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .optional()
    .nullable(),
});
export type TTransaction = z.infer<typeof ZTransaction>;

export const ZTransactionCreate = z.object({
  amount: z.number({
    required_error: "Amount is required",
  }),
  type: z.enum(["INCOME", "EXPENSE"], {
    required_error: "Type is required",
  }),
  description: z.string().nullable().optional(),
  date: z.string().pipe(z.coerce.date()),
  categoryId: z.string().cuid(),
  recurring: z.boolean().optional().default(false),
  recurringType: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .optional()
    .nullable(),
});
export type TTransactionCreate = z.infer<typeof ZTransactionCreate>;

export const ZTransactionUpdate = z.object({
  amount: z.number(),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().nullable().optional(),
  date: z.date().optional(),
  categoryId: z.string().cuid().optional(),
});
export type TTransactionUpdate = z.infer<typeof ZTransactionUpdate>;

export type TCategory = Category & {
  transactions: number;
  totalIncome: number;
  totalExpenses: number;
};

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color format"),
});

export type TCategoryCreateInput = z.infer<typeof categoryCreateSchema>;

export const categoryUpdateSchema = z.object({
  name: z.string().min(1, "Category name is required").optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color format").optional(),
});

export type TCategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;