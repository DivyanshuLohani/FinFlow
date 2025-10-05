import { TCategoryUpdateInput } from "@/types/transaction";

export async function createCategory(data: { name: string; color: string }) {
  const { name, color } = data;
  const res = await fetch("/api/v1/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, color }),
  });

  if (!res.ok) {
    throw new Error("Failed to create category");
  }

  const category = await res.json();
  return category;
}

export async function updateCategory(id: string, data: TCategoryUpdateInput) {
  const res = await fetch(`/api/v1/categories/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update category");
  }

  const category = await res.json();
  return category;
}

export async function deleteCategory(categoryId: string) {
  const res = await fetch(`/api/v1/categories/${categoryId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.status;
}

export async function getCategories() {
  const res = await fetch("/api/v1/categories");

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories = await res.json();
  return categories;
}
