import {
  getIncomeExpenseTrend,
  getSpendingByCategory,
} from "@/lib/user/analytics";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: any }) {
  const { searchParams } = new URL(req.url);
  const startDate = new Date(searchParams.get("startDate") || "");
  const endDate = new Date(searchParams.get("endDate") || "");
  const { slug } = await params;
  switch (slug) {
    case "spending-by-category":
      const spending = await getSpendingByCategory({ startDate, endDate });
      return NextResponse.json(spending);
    case "income-expense-trend":
      const trend = await getIncomeExpenseTrend({ startDate, endDate });
      return NextResponse.json(trend);
    default:
      return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
