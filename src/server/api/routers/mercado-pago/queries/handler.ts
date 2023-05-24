import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import { mercadoPago } from "src/server/api/routers/mercado-pago/(lib)";
import { env } from "$/env.mjs";
import {
  type CreateSubscriptionJSONResponse,
  type CreateSubscriptionSchema,
} from "$/server/api/routers/mercado-pago/(lib)/create-subscription";

export const mercadoPagoQueries = createTRPCRouter({
  getActivePlans: protectedVerifiedProcedure.query(() => {
    return mercadoPago.getActivePlans();
  }),
  createSubscriptionLink: protectedVerifiedProcedure.mutation(
    async ({ ctx }) => {
      const subscriptionPlan = {
        auto_recurring: {
          frequency_type: "months",
          frequency: 1,
          currency_id: "COP",
          transaction_amount: 5950,
        },
        back_url: "https://lucaspatron.com",
        reason: "Plan Premium",
        status: "pending",
        payer_email: ctx.session.user.email,
      } satisfies CreateSubscriptionSchema;

      const res = await fetch("https://api.mercadopago.com/preapproval_plan", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionPlan),
      });

      return (await res.json()) as CreateSubscriptionJSONResponse;
    }
  ),
});
