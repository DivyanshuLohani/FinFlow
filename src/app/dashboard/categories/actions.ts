export async function createCategory(name: string) {
  const res = await fetch("/api/v1/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to create category");
  }

  const category = await res.json();
  return category;
}

export async function deleteCategory(categoryId: string) {
  const res = await fetch(`/api/v1/categories/${categoryId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete category");
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
