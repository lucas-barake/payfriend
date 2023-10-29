export type RateLimitConfig = {
  maxRequests: number;
  window: number;
  windowType: "seconds" | "minutes" | "hours" | "days" | "weeks";
};

export type RateLimitOptions = Record<string, RateLimitConfig>;
