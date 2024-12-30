import { authOptions } from "@/lib/auth/authOptions";
import { getRecentTransactions } from "@/lib/user/analytics";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const transactions = await getRecentTransactions();
  return Response.json(transactions);
}
