import { createTRPCRouter } from "$/server/api/trpc";
import createDebt from "$/server/api/routers/groups/debts/createDebt/handler";

const debtsSubRouter = createTRPCRouter({
  createDebt,
});

export default debtsSubRouter;
