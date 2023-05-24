import { mergeTRPCRouters } from "$/server/api/trpc";
import { debtInvitesRouter } from "$/server/api/routers/user/debt-invites/subrouter";
import { phoneSubRouter } from "$/server/api/routers/user/phone/subrouter";

const userRouter = mergeTRPCRouters(phoneSubRouter, debtInvitesRouter);

export { userRouter };
