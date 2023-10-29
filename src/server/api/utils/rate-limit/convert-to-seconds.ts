import { type RateLimitConfig } from "$/server/api/utils/rate-limit/types";

export function convertToSeconds(
  amount: number,
  type: RateLimitConfig["windowType"]
): number {
  switch (type) {
    case "seconds":
      return amount;
    case "minutes":
      return amount * 60;
    case "hours":
      return amount * 60 * 60;
    case "days":
      return amount * 60 * 60 * 24;
    case "weeks":
      return amount * 60 * 60 * 24 * 7;
    default:
      return amount;
  }
}
