import { updateRecurringTransactions } from "@/lib/transaction/service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized", status: 401 });
  }
  // Update recurring transactions
  try {
    await updateRecurringTransactions();
  } catch {
    return NextResponse.json({
      message: "Error updating recurring transactions",
      status: 500,
    });
  }

  return NextResponse.json({ ok: true });
}
