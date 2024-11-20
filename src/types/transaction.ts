import { z } from "zod";

export const ZTransaction = z.object({
  id: z.string().cuid(),
  amount: z.number(),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().nullable(),
  date: z.date().default(() => new Date()),
  userId: z.string().cuid(),
  categoryId: z.string().cuid(),
});

export type TTransaction = z.infer<typeof ZTransaction>;

// Category Schema
export const ZCategory = z.object({
  id: z.string().cuid(),
  name: z.string(),
  type: z.enum(["INCOME", "EXPENSE"]),
  userId: z.string().cuid(),
});
