"use client";
import { getTimeFrame } from "@/lib/utils/time";
import { TTransaction } from "@/types/transaction";
import React, { useEffect, useState } from "react";
import { getTransactions } from "../actions";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "path";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function TransactionList() {
  const [transactions, setTransactions] = useState<TTransaction[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [timeFrame, setTimeFrame] = useState(getTimeFrame("month"));
  const [page, setPage] = useState(1);

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesSearch =
      transaction.category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
    return matchesType && matchesSearch;
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsFetching(true);
      const res = await getTransactions(1, timeFrame);
      setTransactions(res.transactions as TTransaction[]);
      setHasMore(res.total === transactions.length ? false : true);
      setIsFetching(false);
    };
    fetchTransactions();
  }, [timeFrame, transactions.length]);

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
            // icon={<Search className="h-4 w-4 text-gray-500" />}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expenses</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.type === "INCOME" ? (
                    <span className="flex items-center text-green-600">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      <span className="hidden sm:inline">Income</span>
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <ArrowDown className="mr-1 h-4 w-4" />
                      <span className="hidden sm:inline">Expense</span>
                    </span>
                  )}
                </TableCell>
                <TableCell>{transaction.category.name}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {formatDate(transaction.date)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
