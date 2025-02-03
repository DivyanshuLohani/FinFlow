import { TTimeFrame } from "@/types/common";

export type SupportedFrames =
  | "day"
  | "week"
  | "month"
  | "year"
  | "yesterday"
  | "all";

export function getTimeFrame(a: SupportedFrames): TTimeFrame {
  switch (a) {
    case "day":
      return {
        startDate: new Date(new Date().setHours(0, 0, 0, 0)),
        endDate: new Date(new Date().setHours(23, 59, 59, 999)),
      };
    case "yesterday":
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
      yesterday.setHours(-18, 0, 0, 0);
      const yesterdayEnd = new Date(yesterday.setDate(yesterday.getDate() + 1));
      yesterdayEnd.setHours(23, 59, 59, 999);

      return {
        startDate: yesterday,
        endDate: yesterdayEnd,
      };
    case "week":
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 0);
      const firstDay = new Date(now.setDate(diff)).setHours(0, 0, 0, 0);
      const lastDay = new Date(now.setDate(diff + 6)).setHours(23, 59, 59, 999);
      return {
        startDate: new Date(firstDay),
        endDate: new Date(lastDay),
      };
    case "month":
      return {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        ),
      };

    case "all":
      return {
        startDate: new Date(1970, 0, 1),
        endDate: new Date(),
      };
  }
  return {
    startDate: new Date(),
    endDate: new Date(),
  };
}

export function getFrameFromDates(
  timeFrame: TTimeFrame
): SupportedFrames | { type: "custom"; startDate: Date; endDate: Date } {
  const { startDate, endDate } = timeFrame;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(23, 59, 59, 999);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  if (
    startDate.getTime() === today.getTime() &&
    endDate.getTime() === todayEnd.getTime()
  ) {
    return "day";
  }
  if (
    startDate.getTime() === yesterday.getTime() &&
    endDate.getTime() === yesterdayEnd.getTime()
  ) {
    return "yesterday";
  }
  if (
    startDate.getTime() === weekStart.getTime() &&
    endDate.getTime() === weekEnd.getTime()
  ) {
    return "week";
  }
  if (
    startDate.getTime() === monthStart.getTime() &&
    endDate.getTime() === monthEnd.getTime()
  ) {
    return "month";
  }
  if (startDate.getFullYear() === 1970 && startDate.getMonth() === 0) {
    return "all";
  }

  return { type: "custom", startDate, endDate };
}
