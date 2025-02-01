"use server";

import { prisma } from "@/lib/database/prisma";
import { unstable_cache } from "next/cache";

const getHomePageData = unstable_cache(
  async () => {
    const [transactions, users] = await prisma.$transaction([
      prisma.transaction.groupBy({
        by: ["type"],
        _sum: {
          amount: true,
        },
        orderBy: { type: "asc" },
      }),
      prisma.user.count(),
    ]);

    const expenses = Math.min(
      10000000,
      transactions.find((transaction) => transaction.type === "EXPENSE")?._sum
        ?.amount || 0
    );
    const income = Math.min(
      10000000,
      transactions.find((transaction) => transaction.type === "INCOME")?._sum
        ?.amount || 0
    );

    return { expenses, income, users };
  },
  [],
  {
    revalidate: 60 * 60 * 24,
  }
);

export { getHomePageData };
