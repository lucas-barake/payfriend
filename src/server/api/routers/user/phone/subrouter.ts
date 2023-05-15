import { mergeTRPCRouters } from "$/server/api/trpc";
import { phoneMutations } from "$/server/api/routers/user/phone/mutations";

export const phoneSubRouter = mergeTRPCRouters(phoneMutations);
