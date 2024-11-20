"use server";

import { TTimeFrame } from "@/types/common";
import { getTransactions as gT } from "@/lib/transaction/service";

export async function getTransactions(page: number, timeFrame: TTimeFrame) {
  const [transactions, total] = await gT(
    page,
    timeFrame.startDate,
    timeFrame.endDate
  );
  return { transactions, total };
}
