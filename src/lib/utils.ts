import { clsx, type ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function titleCase(str: string) {
  return str
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatDate(
  date: Date | string,
  style: Intl.DateTimeFormatOptions["dateStyle"] = "long"
) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: style,
  }).format(date);
}

/**
 * Formats a number into currenget cy format based on the user's locale.
 *
 * @param amount - The numeric amount to be formatted.
 * @param currency - The currency code (e.g., "USD", "EUR", "INR").
 * @param locale - The user's locale (e.g., "en-US", "de-DE", "fr-FR"). Defaults to the user's browser locale.
 * @returns A string representing the formatted currency.
 */
export function formatCurrency(
  amount: number,
  currency: string = "INR"
  // locale: string = navigator.language
): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);
}
