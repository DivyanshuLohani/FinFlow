import { z } from "zod";
// User Schema
export const ZUser = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  emailVerified: z.date().nullable(),
  image: z.string().url().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
});

export type TUser = z.infer<typeof ZUser>;

// User Create Input Schema
export const ZUserCreateInput = z.object({
  name: z.string().nullable(),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .nullable(),
  image: z.string().url().optional().nullable().default(null),
  emailVerified: z.date().optional().nullable().default(null),
});

export type TUserCreateInput = z.infer<typeof ZUserCreateInput>;

// User Update Input Schema
export const ZUserUpdateInput = z.object({
  name: z.string().nullable().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .nullable()
    .optional(),
  emailVerified: z.date().nullable().optional(),
  image: z.string().url().optional().nullable(),
});

export type TUserUpdateInput = z.infer<typeof ZUserUpdateInput>;
