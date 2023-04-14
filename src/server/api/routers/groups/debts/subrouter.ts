import { createTRPCRouter } from "$/server/api/trpc";
import createDebt from "$/server/api/routers/groups/debts/create-debt/handler";

const debtsSubRouter = createTRPCRouter({
  createDebt,
});

export default debtsSubRouter;
