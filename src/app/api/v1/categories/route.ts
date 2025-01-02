import { createCategory, getCategories } from "@/lib/transaction/service";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const category = await createCategory(name);
  return NextResponse.json(category);
}
