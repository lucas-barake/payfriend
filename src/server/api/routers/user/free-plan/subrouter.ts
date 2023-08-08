import { createTRPCRouter, TRPCProcedures } from "$/server/api/trpc";
import { getFreePlanDebtLimitCount } from "$/server/api/routers/debts/(lib)/utils/check-debt-limit-and-incr";

export const userFreePlanSubRouter = createTRPCRouter({
  getFreePlanDebtLimitCount: TRPCProcedures.protected.query(async ({ ctx }) => {
    return (
      (await getFreePlanDebtLimitCount(ctx.redis, ctx.session.user.id)) ?? 0
    );
  }),
});
