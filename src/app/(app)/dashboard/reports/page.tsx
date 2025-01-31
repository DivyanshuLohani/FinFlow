import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomeVsExpense from "./components/IncomeVsExpense";
import {
  getCategoryData,
  getMonthlyExpenseVsIncome,
} from "@/lib/transaction/reports";
import { getTotalExpenses, getTotalIncome } from "@/lib/user/analytics";
import { getTimeFrame } from "@/lib/utils/time";
import { formatCurrency } from "@/lib/utils";
import TransactionTypeTab from "./components/IncomeTab";

export default async function ReportsPage() {
  const incomeVsExenseData = await getMonthlyExpenseVsIncome();
  const categoryData = await getCategoryData(getTimeFrame("month"));
  const totalIncome = await getTotalIncome(getTimeFrame("month"));
  const totalExpense = await getTotalExpenses(getTimeFrame("month"));
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
