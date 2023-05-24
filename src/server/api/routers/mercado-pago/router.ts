import { mergeTRPCRouters } from "$/server/api/trpc";
import { mercadoPagoQueries } from "$/server/api/routers/mercado-pago/queries/handler";

export const mercadoPagoRouter = mergeTRPCRouters(mercadoPagoQueries);
