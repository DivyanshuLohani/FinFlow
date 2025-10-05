import { prisma } from "@/lib/database/prisma";
import { updateCategory, deleteCategory } from "@/lib/transaction/service";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: any }) {
  const { id } = await params;

  try {
    await deleteCategory(id);
    return Response.json({}, { status: 204 });
  } catch (e: any) {
    if (e.message) {
      return new Response(JSON.stringify({ message: e.message }), {
        status: 400,
      });
    }
    return new Response(
      JSON.stringify({ message: "Failed to delete category" }),
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: any }) {
  const id = params.id;
  const data = await req.json();
  const updatedCategory = await updateCategory(id, data);
  // The category has just been updated
  const transactions = await prisma.transaction.findMany({
    where: { categoryId: updatedCategory.id },
  });

  const totalIncome = transactions.reduce(
    (sum, t) => sum + (t.type === "INCOME" ? t.amount : 0),
    0
  );

  const totalExpenses = transactions.reduce(
    (sum, t) => sum + (t.type === "EXPENSE" ? t.amount : 0),
    0
  );

  return NextResponse.json({ ...updatedCategory, totalIncome, totalExpenses });
}
