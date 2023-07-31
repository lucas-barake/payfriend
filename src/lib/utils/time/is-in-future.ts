import { DateTime } from "luxon";

export function isInFuture(date: Date): boolean {
  return DateTime.fromJSDate(date) > DateTime.now();
}
