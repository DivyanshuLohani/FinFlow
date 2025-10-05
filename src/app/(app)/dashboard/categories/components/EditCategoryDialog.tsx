"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

import { updateCategory } from "../actions";
import { categoryUpdateSchema, TCategory } from "@/types/transaction";

type EditCategoryModalProps = {
  category: TCategory;
  onUpdateCategory: (category: TCategory) => any;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function EditCategoryModal({
  category,
  onUpdateCategory,
  isOpen,
  setIsOpen,
}: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color || "#cccccc");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(category.name);
    setColor(category.color);
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      categoryUpdateSchema.parse({ name, color });
    } catch {
      toast.error("Invalid category name or color");
      setIsLoading(false);
      return;
    }

    try {
      const updatedCategory = await updateCategory(category.id, { name, color });
      await onUpdateCategory(updatedCategory);
      setIsOpen(false);
      toast.success("Category updated successfully!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Enter the new name and color for your category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
