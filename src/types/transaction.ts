import { type Category } from "@prisma/client";
import { z } from "zod";
// Category Schema
export const ZCategory = z.object({
  id: z.string().cuid(),
  name: z.string(),
  userId: z.string().cuid(),
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
});

export type TTransaction = z.infer<typeof ZTransaction>;

export type TCategory = Category & {
  transactions: number;
  totalIncome: number;
  totalExpenses: number;
};

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export type TCategoryCreateInput = z.infer<typeof categoryCreateSchema>;
