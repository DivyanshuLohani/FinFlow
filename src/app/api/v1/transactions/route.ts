import { authOptions } from "@/lib/auth/authOptions";
import { createTransaction } from "@/lib/transaction/service";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  let data = await request.json();
  data = {
    ...data,
    userId: session.user.id,
    amount: Number(data.amount),
  };

  try {
    const transaction = await createTransaction(data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/transactions");
    return Response.json(transaction, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
