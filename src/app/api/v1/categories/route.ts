import { prisma } from "@/lib/database/prisma";
import { createCategory, getCategories } from "@/lib/transaction/service";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await getCategories();
  const returnCategories = [];
  for (const category of categories) {
    const transactions = await prisma.transaction.findMany({
      where: { categoryId: category.id, deletedAt: null },
    });

    const totalIncome = transactions.reduce(
      (sum, t) => sum + (t.type === "INCOME" ? t.amount : 0),
      0
    );

    const totalExpenses = transactions.reduce(
      (sum, t) => sum + (t.type === "EXPENSE" ? t.amount : 0),
      0
    );

    returnCategories.push({
      ...category,
      totalIncome,
      totalExpenses,
    });
  }
  return NextResponse.json(returnCategories);
}

export async function POST(req: Request) {
  const { name, color } = await req.json();
  const category = await createCategory({ name, color });
  // The category has just been created
  return NextResponse.json({
    ...category,
    totalIncome: 0,
    totalExpenses: 0,
  });
}
