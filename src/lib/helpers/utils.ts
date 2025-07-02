import { Currency } from "./types";
import { formatInTimeZone } from "date-fns-tz";

export const primaryColor = "#31e4ff";

export function trimAndCapitalize(str: string): string {
  const trimmedStr = str.trim();
  return trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1);
}

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function roundToTwoDp(value: number): number {
  return Math.round(value * 100) / 100;
}

export const currencies: Currency[] = [
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
];

export const paymentOptions = ["TRANSFERRED", "CASH"];

export function formatDateTime(date: Date): string {
  return formatInTimeZone(date, "UTC", "dd/MM/yyyy (HH:mm)");
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function checkIsPassedOrUpcomingEvent(
  startDateTime: Date,
  endDateTime: Date | null = null,
  upcomingOrPassed: "upcoming" | "passed"
): boolean {
  const now = new Date();
  if (endDateTime) {
    return upcomingOrPassed === "passed"
      ? endDateTime < now
      : startDateTime > now;
  }
  return upcomingOrPassed === "passed"
    ? startDateTime < now
    : startDateTime > now;
}

export function formatLocalDateTime(date: Date): string {
  if (!date) return "";
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
