"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  Pie,
  Cell,
  Tooltip,
  Legend,
  PieChart,
} from "recharts";

interface CategoryData {
  name: string;
  income: number;
  expenses: number;
}

interface IncomeTabProps {
  categoryData: CategoryData[];
  type: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function TransactionTypeTab({
  categoryData,
  type,
}: IncomeTabProps) {
  const data = useMemo(() => {
    return categoryData
      .filter((entry) => {
        const value = type === "EXPENSE" ? entry.expenses : entry.income;
        return value !== 0; // Exclude items with 0 value
      })
      .map((entry) => ({
        name: entry.name,
        value: type === "EXPENSE" ? entry.expenses : entry.income,
      }));
  }, [categoryData, type]);

  return (
    <TabsContent value={type} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Income Sources</CardTitle>
          <CardDescription>Breakdown of income by category</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
