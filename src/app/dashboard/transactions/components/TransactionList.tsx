"use client";
import { getTimeFrame } from "@/lib/utils/time";
import { TTransaction } from "@/types/transaction";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTransactions } from "../actions";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TransactionRow from "./TransactionRow";
import { TransactionsSkeleton } from "./loading";
import TransactionFilter from "./TransactionFilter";
import TransactionTimeframe from "./TransactionTimeframe";
import ExportData from "./ExportData";

export default function TransactionList() {
  const [transactions, setTransactions] = useState<TTransaction[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState("all");
  const [page, setPage] = useState(1);

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const hasMoreObserver = useRef<HTMLDivElement>(null);

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedTransactions = [...transactions].sort((a, b) => {
      if (key === "date") {
        if (a.date < b.date) return direction === "asc" ? -1 : 1;
        if (a.date > b.date) return direction === "asc" ? 1 : -1;
      } else if (key === "amount") {
        if (a.amount < b.amount) return direction === "asc" ? -1 : 1;
        if (a.amount > b.amount) return direction === "asc" ? 1 : -1;
      } else if (key === "description") {
        const descriptionA = a.description || "";
        const descriptionB = b.description || "";

        if (descriptionA < descriptionB) return direction === "asc" ? -1 : 1;
        if (descriptionA > descriptionB) return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setTransactions(sortedTransactions);
  };

  const fetchTransactions = useCallback(async () => {
    setIsFetching(true);
    const res = await getTransactions(page, getTimeFrame(timeFrame as any));
    setTransactions(res.transactions);

    setIsFetching(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, timeFrame]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // useEffect(() => {
  //   if (!window || !hasMoreObserver.current) return;
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasMore && !isFetching) {
  //         setPage((prev) => prev + 1);
  //         console.log("Fetch More");
  //       }
  //     },
  //     { threshold: 0.6 }
  //   );
  //   observer.observe(hasMoreObserver.current);
  //   return () => observer.disconnect();
  // }, [hasMore, isFetching]);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchesType =
          filterType === "all" || transaction.type === filterType;
        const matchesSearch =
          transaction.category.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.amount.toString().includes(searchTerm);
        return matchesType && matchesSearch;
      }),
    [transactions, filterType, searchTerm]
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-4">
          <TransactionFilter
            filterType={filterType}
            setFilterType={setFilterType}
          />
          <TransactionTimeframe
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
          />
          <ExportData transactions={transactions} />
        </div>
      </div>
      {isFetching ? (
        <TransactionsSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent"
                    onClick={() => handleSort("type")}
                  >
                    <span className="sr-only">Sort by Type</span>
                    Type
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent"
                    onClick={() => handleSort("category")}
                  >
                    <span className="sr-only">Sort by Category</span>
                    Category
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent"
                    onClick={() => handleSort("amount")}
                  >
                    <span className="sr-only">Sort by Amount</span>
                    Amount
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent"
                    onClick={() => handleSort("date")}
                  >
                    <span className="sr-only">Sort by Date</span>
                    Date
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    <span className="sr-only">Sort by Date</span>
                    Actions
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  setTransactions={setTransactions}
                />
              ))}
            </TableBody>
          </Table>
          {/* <div
            ref={hasMoreObserver}
            className="h-10 flex items-center justify-center"
          >
            {isFetching && hasMore && <p>Loading more transactions...</p>}
          </div> */}
        </div>
      )}
    </div>
  );
}
