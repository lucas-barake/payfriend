import { DateTime } from "luxon";
import { DebtRecurringFrequency } from "@prisma/client";

type Args = {
  createdAt: Date;
  duration: number;
  recurringFrequency: DebtRecurringFrequency;
};

export function getRecurrentDebtFinalPayment(args: Args): DateTime {
  return DateTime.fromJSDate(args.createdAt).plus({
    ...(args.recurringFrequency === DebtRecurringFrequency.MONTHLY && {
      month: args.duration,
    }),
    ...(args.recurringFrequency === "WEEKLY" && {
      day: args.duration * 7,
    }),
    ...(args.recurringFrequency === "BIWEEKLY" && {
      day: args.duration * 14,
    }),
  });
}
