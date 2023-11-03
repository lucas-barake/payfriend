import { type DebtRecurringFrequency } from "@prisma/client";
import { DateTime } from "luxon";

type Args = {
  recurringFrequency: DebtRecurringFrequency;
  duration: number;
  createdAt: Date;
};

export function getRecurrentCycleDates(args: Args): DateTime[] {
  const allCyclesDates: DateTime[] = [];

  for (let i = 0; i < args.duration; i++) {
    const cycleDate = DateTime.fromJSDate(args.createdAt).plus({
      ...(args.recurringFrequency === "MONTHLY" && { month: i }),
      ...(args.recurringFrequency === "WEEKLY" && { days: i * 7 }),
      ...(args.recurringFrequency === "BIWEEKLY" && { days: i * 14 }),
    });
    allCyclesDates.push(cycleDate);
  }

  return allCyclesDates;
}
