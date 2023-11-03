import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { type InnerTRPCContext } from "$/server/api/trpc";
import { type RateLimitConfig } from "$/server/api/utils/rate-limit/types";
import { convertToSeconds } from "$/server/api/utils/rate-limit/convert-to-seconds";

export async function rateLimit(
  ctx: {
    redis: InnerTRPCContext["redis"];
    session: NonNullable<InnerTRPCContext["session"]>;
  },
  args: RateLimitConfig
): Promise<void> {
  const key =
    `rate-limit:${args.uniqueId}:${ctx.session.user.id}` satisfies `rate-limit:${string}:${string}`;
  const current = await ctx.redis.incr(key);

  const windowInSeconds = convertToSeconds(args.window, args.windowType);

  if (current === 1) {
    await ctx.redis.expire(key, windowInSeconds);
  }

  if (current > args.maxRequests) {
    throw CUSTOM_EXCEPTIONS.TOO_MANY_REQUESTS();
  }
}
