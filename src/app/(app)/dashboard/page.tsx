import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddTransactionDialog from "./components/AddIncomeDialog";
import { getCategories } from "@/lib/transaction/service";
import RecentTransactions from "./components/RecentTransactions";
import TransactionMetrics from "./components/TransactionMetrics";

export default async function DashboardPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <TransactionMetrics />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentTransactions />
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Add new transactions or view reports
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <AddTransactionDialog categories={categories} type="INCOME" />
            <AddTransactionDialog categories={categories} type="EXPENSE" />
            <Button variant="outline" className="w-full">
              <Link
                href="/dashboard/reports"
                className="flex items-center justify-center"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
