import { FREE_PLAN_DEBT_LIMIT } from "$/server/api/routers/user/free-plan/lib/constants/free-plan-debt-limit";
import { api } from "$/lib/utils/api";

type Return = {
  reachedMonthlyLimit: boolean;
  createdDebtsThisMonth: number;
  invalidateQuery: () => Promise<void>;
};

export function useFreePlanLimit(): Return {
  const utils = api.useUtils();
  const createdDebtsThisMonth =
    utils.user.getFreePlanDebtLimitCount.getData() ?? 0;
  const reachedMonthlyLimit = createdDebtsThisMonth >= FREE_PLAN_DEBT_LIMIT;

  async function invalidateQuery(): Promise<void> {
    await utils.user.getFreePlanDebtLimitCount.invalidate();
  }

  return {
    reachedMonthlyLimit,
    createdDebtsThisMonth,
    invalidateQuery,
  };
}
