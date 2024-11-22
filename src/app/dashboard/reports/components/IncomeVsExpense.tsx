"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts";

interface IncomeVsExpenseProps {
  monthlyData: { name: string; income: number; expenses: number }[];
}

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function IncomeVsExpense({ monthlyData }: IncomeVsExpenseProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>
          Monthly comparison of income and expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={monthlyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey="income"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              dataKey="expenses"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="green" radius={4} />
            <Bar dataKey="expenses" fill="red" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
