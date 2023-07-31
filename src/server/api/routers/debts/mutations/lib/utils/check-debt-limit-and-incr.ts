import { type InnerTRPCContext } from "$/server/api/trpc";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { logger } from "$/server/logger";
import { FREE_PLAN_DEBT_LIMIT } from "$/server/api/routers/user/free-plan/lib/constants/free-plan-debt-limit";

type Args = {
  session: NonNullable<InnerTRPCContext["session"]>;
  redis: InnerTRPCContext["redis"];
};

export const FREE_PLAN_DEBT_LIMIT_KEY = "free-plan-debt-limit";

export function getFreePlanDebtLimitKey(userId: string): string {
  return `${FREE_PLAN_DEBT_LIMIT_KEY}:${userId}`;
}

export async function getFreePlanDebtLimitCount(
  redis: InnerTRPCContext["redis"],
  userId: string
): Promise<number | null> {
  const key = getFreePlanDebtLimitKey(userId);
  const value = await redis.get(key);
  return value !== null ? parseInt(value) : null;
}

/**
 * Checks if the user has exceeded the debt limit and increments the count of debts for a given user in the Redis database.
 * If the user is on the free plan and has reached the debt limit (5 debts), BAD_REQUEST custom exception is thrown.
 * @param session The session of the user.
 * @param redis The Redis client.
 * @returns Promise<void> A promise that resolves to void.
 * @throws BAD_REQUEST custom exception if the user is on the free plan and has reached the debt limit.
 **/
export async function checkDebtLimitAndIncr({
  session,
  redis,
}: Args): Promise<void> {
  if (
    session.user.subscription?.isActive === false ||
    session.user.subscription === null
  ) {
    const key = getFreePlanDebtLimitKey(session.user.id);
    const count = await getFreePlanDebtLimitCount(redis, session.user.id);

    if (count !== null && count >= FREE_PLAN_DEBT_LIMIT) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "Has alcanzado el límite de deudas para tu plan"
      );
    }

    const oneMonthInSeconds = 60 * 60 * 24 * 30;
    const val = await redis.incr(key);
    if (val === 1) {
      await redis.expire(key, oneMonthInSeconds);
    }
    logger.info(
      `Debt limit for user ${session.user.id} incremented, new value: ${val}`
    );
  }
}
