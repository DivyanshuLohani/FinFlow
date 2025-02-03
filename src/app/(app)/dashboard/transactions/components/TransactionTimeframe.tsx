"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  getFrameFromDates,
  getTimeFrame,
  SupportedFrames,
} from "@/lib/utils/time";
import { TTimeFrame } from "@/types/common";

interface TransactionTimeframeProps {
  timeFrame: TTimeFrame;
  setTimeFrame: (type: TTimeFrame) => void;
  className?: string;
}

export default function TransactionTimeframe({
  timeFrame,
  setTimeFrame,
  className,
}: TransactionTimeframeProps) {
  const [customRange, setCustomRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [customOpen, setCustomOpen] = useState(false);
  const [displayTimeFrame, setDisplayTimeFrame] = useState(() => {
    const d = getFrameFromDates(timeFrame);
    if (typeof d === "string") return d;
    setCustomRange({ startDate: d.startDate, endDate: d.endDate });
    return "custom";
  });
  useEffect(() => {
    console.log(displayTimeFrame);
  }, [displayTimeFrame]);

  const handleTimeFrameChange = (value: string) => {
    setDisplayTimeFrame(value as SupportedFrames);
    if (value === "custom") {
      setCustomOpen(true);
    } else {
      setTimeFrame(getTimeFrame(value as SupportedFrames));
    }
  };

  return (
    <>
      <Select value={displayTimeFrame} onValueChange={handleTimeFrameChange}>
        <SelectTrigger className={twMerge("w-full sm:w-auto", className)}>
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="day">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
          <SelectItem value="custom">
            {format(customRange.startDate, "PPP")} -{" "}
            {format(customRange.endDate, "PPP")}
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Custom Date Range Picker Modal */}
      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent>
          <DialogTitle>Select a custom range</DialogTitle>

          <Label>Start Date</Label>
          <Popover modal>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 justify-start text-left font-normal",
                  "text-muted-foreground"
                )}
              >
                {customRange.startDate ? (
                  format(customRange.startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customRange.startDate}
                onSelect={(value) => {
                  if (value)
                    setCustomRange({ ...customRange, startDate: value });
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
              />
            </PopoverContent>
          </Popover>

          <Label>End Date</Label>
          <Popover modal>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 justify-start text-left font-normal",
                  "text-muted-foreground"
                )}
              >
                {customRange.endDate ? (
                  format(customRange.endDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customRange.endDate}
                onSelect={(value) => {
                  if (value) setCustomRange({ ...customRange, endDate: value });
                }}
                disabled={(date) =>
                  date > new Date() || date < customRange.startDate
                }
              />
            </PopoverContent>
          </Popover>

          <Button
            className="mt-4"
            onClick={() => {
              setTimeFrame({
                startDate: customRange.startDate,
                endDate: customRange.endDate,
              });
              setCustomOpen(false);
            }}
          >
            Apply
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
