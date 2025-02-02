import { deleteCategory } from "@/lib/transaction/service";

export async function DELETE(req: Request, { params }: { params: any }) {
  const { id } = await params;

  try {
    await deleteCategory(id);
    return Response.json({}, { status: 204 });
  } catch (e: any) {
    if (e.message) {
      return new Response(JSON.stringify({ message: e.message }), {
        status: 400,
      });
    }
    return new Response(
      JSON.stringify({ message: "Failed to delete category" }),
      { status: 500 }
    );
  }
}
