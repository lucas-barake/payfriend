import { mergeTRPCRouters } from "$/server/api/trpc";
import { phoneMutations } from "$/server/api/routers/user/phone/mutations/handler";

export const phoneSubRouter = mergeTRPCRouters(phoneMutations);
