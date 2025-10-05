"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { ChartSkeleton } from "./ChartSkeleton";

export default function SpendingByCategoryChart() {
  const [data, setData] = useState<any[]>([]);
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
        const formattedData = result.map((item: any) => ({
          category: item.category.name,
          amount: item._sum.amount,
          color: item.category.color,
        }));
        setData(formattedData);
      } catch (error) {
        toast.error("Could not load spending data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartConfig = useMemo(() => {
    if (data.length === 0) return {};
    return data.reduce((acc, item) => {
      acc[item.category] = {
        label: item.category,
        color: item.color,
      };
      return acc;
    }, {} as ChartConfig);
  }, [data]);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (data.length === 0) {
    return <div className="w-full h-60 md:h-80 flex items-center justify-center">No spending data for this month.</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-60">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="amount" hideLabel />} />
        <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80}>
          {data.map((entry) => (
            <Cell key={entry.category} fill={`var(--color-${entry.category})`} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="category" />} />
      </PieChart>
    </ChartContainer>
  );
}