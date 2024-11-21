import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionTimeframeProps {
  timeFrame: string;
  setTimeFrame: (type: string) => void;
}

export default function TransactionTimeframe({
  timeFrame,
  setTimeFrame,
}: TransactionTimeframeProps) {
  return (
    <Select value={timeFrame} onValueChange={setTimeFrame}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="day">Today</SelectItem>
        <SelectItem value="yesterday">Yesterday</SelectItem>
        <SelectItem value="week">This Week</SelectItem>
        <SelectItem value="month">This Month</SelectItem>
        <SelectItem value="quarter">This Quarter</SelectItem>
        <SelectItem value="semester">This Semester</SelectItem>
        <SelectItem value="year">This Year</SelectItem>
      </SelectContent>
    </Select>
  );
}
