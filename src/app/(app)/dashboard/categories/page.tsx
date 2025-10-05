"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { AddCategoryModal } from "./components/AddCategoryDialog";
import CategoryCard from "./components/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TCategory } from "@/types/transaction";
import { useCategories } from "@/hooks/use-category";

function CategoryCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow animate-pulse">
      <Skeleton className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="w-1/3 h-4 rounded"></Skeleton>
        <Skeleton className="h-8 w-8 rounded-full "></Skeleton>
      </Skeleton>
      <Skeleton className="p-6 pt-0">
        <Skeleton className="h-6  rounded w-full"></Skeleton>
      </Skeleton>
    </div>
  );
}

export default function CategoriesPage() {
  const [isFetching, setIsFetching] = useState(true);
  const { addCategory, removeCategory, updateCategory } = useCategories();
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [search, setSearch] = useState<string>("");

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  );

  useEffect(() => {
    const loadCategories = async () => {
      setIsFetching(true);
      try {
        const fetchedCategories = await fetch("/api/v1/categories");
        if (!fetchedCategories.ok) {
          toast.error("Failed to load categories. Please try again.");
          return;
        }
        const data = await fetchedCategories.json();
        setCategories(data);
      } catch {
        toast.error("Failed to load categories. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };
    loadCategories();
  }, []);

  const handleUpdateCategory = (updatedCategory: TCategory) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
    updateCategory(updatedCategory);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search a category name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mr-2"
        />
        <AddCategoryModal
          onAddCategory={(category) => {
            setCategories((prev) => [...prev, category]);
            addCategory(category);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isFetching &&
          Array.from({ length: 12 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}

        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onDelete={(c) => {
              {
                setCategories((prev) => prev.filter((cat) => cat.id !== c.id));
                removeCategory(c.id);
              }
            }}
            onUpdate={handleUpdateCategory as any}
          />
        ))}
      </div>
    </div>
  );
}