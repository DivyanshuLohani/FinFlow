"use server";

import { prisma } from "@/lib/database/prisma";
import { TransactionType } from "@prisma/client";
import { unstable_cache } from "next/cache";

const getHomePageData = unstable_cache(
  async () => {
    const [expenses, income, users] = await prisma.$transaction([
      prisma.transaction.count({ where: { type: TransactionType.EXPENSE } }),
      prisma.transaction.count({ where: { type: TransactionType.EXPENSE } }),
      prisma.user.count(),
    ]);

    return { expenses, income, users };
  },
  [],
  {
    revalidate: 60 * 60 * 24,
  }
);

export { getHomePageData };
