"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getTimeFrame } from "@/lib/utils/time";
import { Banknote, TrendingUp, TrendingDown } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import TransactionTimeframe from "../transactions/components/TransactionTimeframe";
import { TTimeFrame } from "@/types/common";
import { getTotalExpenses, getTotalIncome } from "../actions";
import SkeletonLoader from "./SkeletonLoaderT";
import { TTransaction } from "@/types/transaction";

export interface TransactionMatricsElement {
  refresh: () => void;
  addTransaction: (transaction: TTransaction) => void;
}

const TransactionMatrics = forwardRef(({}, ref) => {
  const [timeFrame, setTimeFrame] = useState<TTimeFrame>(getTimeFrame("month"));
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isFetching, setIsFetching] = useState(true);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      gTIS();
    },
    addTransaction: (transaction: TTransaction) => {
      if (transaction.type === "INCOME") {
        setTotalIncome((prev) => prev + transaction.amount);
      } else {
        setTotalExpense((prev) => prev + transaction.amount);
      }
    },
  }));

  const gTIS = async () => {
    const income = await getTotalIncome(timeFrame);
    const expenses = await getTotalExpenses(timeFrame);
    setTotalIncome(income);
    setTotalExpense(expenses);
    setIsFetching(false);
  };

  const totalBalance = useMemo(() => {
    return totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  useEffect(() => {
    setIsFetching(true);
    gTIS();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFrame]);
  if (isFetching) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-2">
      <TransactionTimeframe setTimeFrame={setTimeFrame} timeFrame={timeFrame} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Banknote
              className="h-4 w-4 text-muted-foreground"
              stroke={totalBalance > 0 ? "green" : "red"}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBalance)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp
              className="h-4 w-4 text-muted-foreground"
              stroke="green"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown
              className="h-4 w-4 text-muted-foreground"
              stroke="red"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

TransactionMatrics.displayName = "TransactionMatrics";

export default TransactionMatrics;
