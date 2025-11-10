import { requireAuth } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/database/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await requireAuth(req);
    const { since } = await req.json();
    const sinceDate = since ? new Date(since) : new Date(0);

    const [transactions, categories] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId, updatedAt: { gt: sinceDate }, deletedAt: null },
      }),
      prisma.category.findMany({
        where: { userId, updatedAt: { gt: sinceDate }, deletedAt: null },
      }),
    ]);

    return new Response(
      JSON.stringify({
        serverTime: new Date().toISOString(),
        transactions,
        categories,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Unauthorized" }),
      { status: 401 }
    );
  }
}
