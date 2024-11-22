import { authOptions } from "@/lib/auth/authOptions";
import { deleteTransaction } from "@/lib/transaction/service";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  await params;
  const id = params.id;

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const result = await deleteTransaction(id);
    return new Response(
      JSON.stringify({ message: "Transaction deleted successfully", result }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete transaction" }),
      { status: 500 }
    );
  }
}
