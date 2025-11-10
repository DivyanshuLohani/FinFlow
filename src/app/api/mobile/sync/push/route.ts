import { requireAuth } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/database/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await requireAuth(req);
    const { changes } = await req.json();

    const conflicts: any[] = [];
    const applied: any = { transactions: [], categories: [] };
    function normalizeIncomingT(data: any) {
      const { isDeleted, ...rest } = data;

      return {
        ...rest,
        date: data.date ? new Date(data.date) : undefined,
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        deletedAt: isDeleted ? new Date() : null,
      };
    }
    function normalizeIncomingC(data: any) {
      const { isDeleted, ...rest } = data;

      return {
        ...rest,
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        deletedAt: isDeleted ? new Date() : null,
      };
    }

    // Helper for upsert with conflict detection
    async function upsertTransaction(data: any) {
      const existing = await prisma.transaction.findUnique({
        where: { id: data.id },
      });
      if (existing && new Date(existing.updatedAt) > new Date(data.updatedAt)) {
        conflicts.push({
          entity: "transactions",
          id: data.id,
          server: existing,
          client: data,
        });
        return false;
      }
      const normalizedData = normalizeIncomingT(data);

      await prisma.transaction.upsert({
        where: { id: data.id },
        update: { ...normalizedData, userId },
        create: { id: data.id, ...normalizedData, userId },
      });
      return true;
    }

    async function upsertCategory(data: any) {
      const existing = await prisma.category.findUnique({
        where: { id: data.id },
      });
      if (existing && new Date(existing.updatedAt) > new Date(data.updatedAt)) {
        conflicts.push({
          entity: "categories",
          id: data.id,
          server: existing,
          client: data,
        });
        return false;
      }
      const normalizedData = normalizeIncomingC(data);
      await prisma.category.upsert({
        where: { id: data.id },
        update: { ...normalizeIncomingC, userId },
        create: { id: data.id, ...normalizedData, userId },
      });
      return true;
    }

    // TRANSACTIONS UPSERT
    for (const t of changes?.transactions?.upserts ?? []) {
      const ok = await upsertTransaction(t);
      if (ok) applied.transactions.push(t.id as string);
    }

    // TRANSACTIONS DELETE (soft delete via deletedAt)
    for (const d of changes?.transactions?.deletes ?? []) {
      const existing = await prisma.transaction.findUnique({
        where: { id: d.id },
      });
      if (existing && new Date(existing.updatedAt) > new Date(d.updatedAt)) {
        conflicts.push({
          entity: "transactions",
          id: d.id,
          server: existing,
          client: { deletedAt: new Date(), ...d },
        });
        continue;
      }
      await prisma.transaction.update({
        where: { id: d.id },
        data: { deletedAt: new Date() },
      });
      applied.transactions.push(d.id);
    }

    // CATEGORIES UPSERT
    for (const c of changes?.categories?.upserts ?? []) {
      const ok = await upsertCategory(c);
      if (ok) applied.categories.push(c.id);
    }

    // CATEGORIES DELETE (soft delete via deletedAt)
    for (const d of changes?.categories?.deletes ?? []) {
      const existing = await prisma.category.findUnique({
        where: { id: d.id },
      });
      if (existing && new Date(existing.updatedAt) > new Date(d.updatedAt)) {
        conflicts.push({
          entity: "categories",
          id: d.id,
          server: existing,
          client: { deletedAt: new Date(), ...d },
        });
        continue;
      }
      await prisma.category.update({
        where: { id: d.id },
        data: { deletedAt: new Date() },
      });
      applied.categories.push(d.id);
    }

    return new Response(
      JSON.stringify({
        applied,
        conflicts,
        serverTime: new Date().toISOString(),
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

export function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
