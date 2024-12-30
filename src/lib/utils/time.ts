import { TTimeFrame } from "@/types/common";

export function getTimeFrame(
  a: "day" | "week" | "month" | "quater" | "semester" | "year" | "yesterday"
): TTimeFrame {
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
    case "quater":
      const currentMonth = new Date().getMonth();
      const quarter = Math.floor(currentMonth / 3);
      const firstMonth = quarter * 3;
      const lastMonth = firstMonth + 2;
      return {
        startDate: new Date(new Date().getFullYear(), firstMonth, 1),
        endDate: new Date(
          new Date().getFullYear(),
          lastMonth + 1,
          0,
          23,
          59,
          59,
          999
        ),
      };
    case "semester":
      const semester = Math.floor(new Date().getMonth() / 6);
      const firstMonthSemester = semester * 6;
      const lastMonthSemester = firstMonthSemester + 5;
      return {
        startDate: new Date(new Date().getFullYear(), firstMonthSemester, 1),
        endDate: new Date(
          new Date().getFullYear(),
          lastMonthSemester + 1,
          0,
          23,
          59,
          59,
          999
        ),
      };
  }
  return {
    startDate: new Date(),
    endDate: new Date(),
  };
}
