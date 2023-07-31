import { type InnerTRPCContext } from "$/server/api/trpc";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { DateTime } from "luxon";

type Args = {
  session: NonNullable<InnerTRPCContext["session"]>;
  redis: InnerTRPCContext["redis"];
};

export const FREE_PLAN_DEBT_LIMIT_KEY = "free-plan-debt-limit";

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
  if (session.user.subscription?.isActive === false) {
    const key = `${FREE_PLAN_DEBT_LIMIT_KEY}:${session.user.id}`;
    const count = await redis.get(key);

    if (count !== null && Number(count) >= 5) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "Has alcanzado el límite de deudas para tu plan"
      );
    }

    await redis.incr(key);
    await redis.expire(key, DateTime.now().plus({ month: 1 }).toSeconds());
  }
}
