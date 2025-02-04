"use client";
import { type Category } from "@prisma/client";
import React, { createContext, useState, ReactNode } from "react";

// Define the shape of the context value
interface CategoryContextValue {
  categories: Category[];
  addCategory: (category: Category) => void;
  removeCategory: (categoryId: string) => void;
}

// Create the context with a default value
export const CategoryContext = createContext<CategoryContextValue | undefined>(
  undefined
);

// Create a provider component
export const CategoryProvider: React.FC<{
  children: ReactNode;
  categories: Category[];
}> = ({ categories: c, children }) => {
  const [categories, setCategories] = useState<Category[]>(c);

  const addCategory = (category: Category) => {
    setCategories((prevCategories) => [...prevCategories, category]);
  };
  const removeCategory = (categoryId: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== categoryId)
    );
  };

  return (
    <CategoryContext.Provider
      value={{ categories, addCategory, removeCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
