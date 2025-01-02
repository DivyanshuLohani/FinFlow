import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
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

interface CategoryCardProps {
  category: TCategory & {
    transactions: number;
    totalIncome: number;
    totalExpenses: number;
  };
  onDelete?: (category: TCategory) => void;
}

export default function CategoryCard({
  category,
  onDelete,
}: CategoryCardProps) {
  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(category.id);
      if (onDelete) onDelete(category);
      toast.success("Category deleted successfully!");
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <Card key={category.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {/* ${category.totalIncome - category.totalExpenses} */}
          {category.name}
        </div>
        {/* <p className="text-xs text-muted-foreground">
          Income: ${category.totalIncome} | Expenses: ${category.totalExpenses}
        </p> */}
      </CardContent>
    </Card>
  );
}
