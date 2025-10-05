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

export function getTextColorFromBg(background: string) {
  const color =
    background.charAt(0) === "#" ? background.substring(1, 7) : background;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179 ? "#000000" : "#FFFFFF";
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
