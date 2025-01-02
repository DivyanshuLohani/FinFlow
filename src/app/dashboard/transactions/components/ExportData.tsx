"use client";
import { Button } from "@/components/ui/button";
import { TTransaction } from "@/types/transaction";
import { DownloadIcon } from "lucide-react";
import React from "react";

export default function ExportData({
  transactions,
}: {
  transactions: TTransaction[];
}) {
  const delimiter = ",";

  const handleExport = () => {
    const header = ["Type", "Category", "Amount", "Date", "Description"].join(
      delimiter
    );

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const csvData = transactions
      .map((transaction) => ({
        Type: transaction.type,
        Category: transaction.category.name,
        Amount: transaction.amount,
        Date: dateFormatter.format(transaction.date).replace(delimiter, ""),
        Description: transaction.description,
      }))
      .map((item) => Object.values(item).join(delimiter))
      .join("\n");

    const blob = new Blob([header + "\n" + csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button startIcon={<DownloadIcon />} onClick={handleExport}>
      Export Data
    </Button>
  );
}
