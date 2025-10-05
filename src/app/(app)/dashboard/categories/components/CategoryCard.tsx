import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { type Category as TCategory } from "@prisma/client";
import { deleteCategory } from "../actions";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { EditCategoryModal } from "./EditCategoryDialog";

interface CategoryCardProps {
  category: TCategory & {
    transactions: number;
    totalIncome: number;
    totalExpenses: number;
  };
  onDelete?: (category: TCategory) => void;
  onUpdate?: (category: TCategory) => void;
}

export default function CategoryCard({
  category,
  onDelete,
  onUpdate,
}: CategoryCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(category.id);
      if (onDelete) onDelete(category);
      toast.success("Category deleted successfully!");
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleUpdateCategory = (updatedCategory: TCategory) => {
    if (onUpdate) onUpdate(updatedCategory);
  };

  return (
    <>
      <EditCategoryModal
        category={category}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        onUpdateCategory={handleUpdateCategory}
      />
      <Card key={category.id} style={{ borderLeft: `4px solid ${category.color}` }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {formatCurrency(category.totalIncome - category.totalExpenses)}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Pencil className="h-4 w-4 cursor-pointer" onClick={() => setIsEditDialogOpen(true)} />
            <AlertDialog>
              <AlertDialogTrigger>
                <Trash2 className="h-4 w-4" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    transactions in this category and the category.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteCategory}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{category.name}</div>
          <p className="text-xs text-muted-foreground">
            Income: {formatCurrency(category.totalIncome)} | Expenses:{" "}
            {formatCurrency(category.totalExpenses)}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
