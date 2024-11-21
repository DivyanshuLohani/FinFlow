import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface TransactionFilterProps {
  filterType: string;
  setFilterType: (type: string) => void;
}

export default function TransactionFilter({
  filterType,
  setFilterType,
}: TransactionFilterProps) {
  return (
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
  );
}
