"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ChartSkeleton } from "./ChartSkeleton";
import { formatCurrency } from "@/lib/utils";

interface SpendingData {
  category: {
    id: string;
    name: string;
    color: string;
  };
  _sum: {
    amount: number;
  };
}

export default function SpendingList() {
  const [data, setData] = useState<SpendingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();

      try {
        const response = await fetch(
          `/api/v1/analytics/spending-by-category?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch {
        toast.error("Could not load spending data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalExpenses = useMemo(() => {
    return data.reduce((acc, item) => acc + item._sum.amount, 0);
  }, [data]);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        No spending data for this month.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = (item._sum.amount / totalExpenses) * 100;
        return (
          <div key={item.category.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{item.category.name}</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(item._sum.amount)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Progress
                value={percentage}
                style={
                  { backgroundColor: `${item.category.color}33` }
                } // Lighter background
              />

            </div>
            <span className="text-xs w-12 text-right">
              {percentage.toFixed(0)}% of total expenses
            </span>
          </div>
        );
      })}
    </div>
  );
}
