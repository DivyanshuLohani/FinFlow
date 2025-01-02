import { deleteCategory } from "@/lib/transaction/service";

export async function DELETE(req: Request, { params }: { params: any }) {
  const { id } = await params;

  try {
    const res = await deleteCategory(id);
    return Response.json(res);
  } catch {
    return new Response(
      JSON.stringify({ message: "Failed to delete category" }),
      { status: 500 }
    );
  }
}
