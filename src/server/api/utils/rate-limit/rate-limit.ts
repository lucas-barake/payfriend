import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { type InnerTRPCContext } from "$/server/api/trpc";
import {
  type RateLimitConfig,
  type RateLimitOptions,
} from "$/server/api/utils/rate-limit/types";
import { convertToSeconds } from "$/server/api/utils/rate-limit/convert-to-seconds";

export const rateLimitOptions = {
  limited: {
    maxRequests: 50,
    window: 10,
    windowType: "minutes",
  },
  critical: {
    maxRequests: 25,
    window: 10,
    windowType: "minutes",
  },
} satisfies RateLimitOptions;

type CustomRateLimit = {
  type: "custom";
  config: RateLimitConfig;
};

type PredefinedRateLimit = {
  type: keyof typeof rateLimitOptions;
};

type RateLimitArgs = CustomRateLimit | PredefinedRateLimit;

export async function rateLimit(
  ctx: {
    redis: InnerTRPCContext["redis"];
    session: NonNullable<InnerTRPCContext["session"]>;
  },
  args: RateLimitArgs
): Promise<void> {
  let config: RateLimitConfig;
  if (args.type === "custom") {
    config = args.config;
  } else {
    config = rateLimitOptions[args.type];
  }

  const key =
    `rate-limit:${args.type}:${ctx.session.user.id}` satisfies `rate-limit:${string}:${string}`;
  const current = await ctx.redis.incr(key);

  const windowInSeconds = convertToSeconds(config.window, config.windowType);

  if (current === 1) {
    await ctx.redis.expire(key, windowInSeconds);
  }

  if (current > config.maxRequests) {
    throw CUSTOM_EXCEPTIONS.TOO_MANY_REQUESTS();
  }
}
