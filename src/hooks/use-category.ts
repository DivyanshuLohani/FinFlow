import { CategoryContext } from "@/providers/category-provider";
import { useContext } from "react";

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
