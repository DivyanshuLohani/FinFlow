"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomeVsExpense from "./components/IncomeVsExpense";

import { formatCurrency } from "@/lib/utils";
import TransactionTypeTab from "./components/IncomeTab";
import { useEffect, useState } from "react";
import { getReportData } from "./actions";
import { getTimeFrame } from "@/lib/utils/time";
import AnalyticsDashboardSkeleton from "./components/Skeleton";

type ReportData = {
  incomeVsExenseData: { name: string; expenses: number; income: number }[];
  categoryData: { name: string; expenses: number; income: number }[];
  totalIncome: number;
  totalExpense: number;
};

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setFetching(true);
      const data = await getReportData(getTimeFrame("month"));

      setReportData(data);
      setFetching(false);
    }
    fetchData();
  }, []);

  if (!reportData && fetching) return <AnalyticsDashboardSkeleton />;

  if (!fetching && !reportData) return <div>No data available</div>;

  const { incomeVsExenseData, categoryData, totalIncome, totalExpense } =
    reportData!;

  const netSavings = totalIncome - totalExpense;
  const savingsRate = (netSavings / totalIncome) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="INCOME">Income</TabsTrigger>
          <TabsTrigger value="EXPENSE">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <IncomeVsExpense monthlyData={incomeVsExenseData} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalIncome)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalExpense)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(netSavings)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Savings Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {savingsRate.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TransactionTypeTab categoryData={categoryData} type="INCOME" />
        <TransactionTypeTab categoryData={categoryData} type="EXPENSE" />
        {/*
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>
            Breakdown of expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                  data={categoryData}
                  cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
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
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
