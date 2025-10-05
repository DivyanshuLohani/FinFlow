import { prisma } from "@/lib/database/prisma";
import { createCategory, getCategories } from "@/lib/transaction/service";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await getCategories();
  const returnCategories = [];
  for (const category of categories) {
    const transactions = await prisma.transaction.findMany({
      where: { categoryId: category.id },
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
      id: category.id,
      name: category.name,
      special: category.special,
      totalIncome,
      totalExpenses,
    });
  }
  return NextResponse.json(returnCategories);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const category = await createCategory(name);
  return NextResponse.json(category);
}
