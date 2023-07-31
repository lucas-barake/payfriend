import { createTRPCRouter, TRPCProcedures } from "$/server/api/trpc";
import { env } from "$/env.mjs";
import { generateLinkInput } from "$/server/api/routers/subscription-plans/mutations/input";
import { z } from "zod";
import {
  type UpdateSubscriptionResponse,
  type CreateSubscriptionRequestBody,
  type CreateSubscriptionResponse,
  type UpdateSubscriptionRequestBody,
} from "$/server/api/routers/subscription-plans/(lib)/types/subscriptions";
import { Pages } from "$/lib/enums/pages";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { logger } from "$/server/logger";
import cuid2 from "@paralleldrive/cuid2";

export const subscriptionsMutations = createTRPCRouter({
  generateLink: TRPCProcedures.verified
    .input(generateLinkInput)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.subscription?.isActive) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
          "An active subscription already exists"
        );
      }

      try {
        const subscription = {
          back_url:
            env.NODE_ENV === "development"
              ? `https://${env.NGROK_FORWARDING_URL ?? ""}/${Pages.DASHBOARD}`
              : `https://${env.VERCEL_URL ?? ""}/${Pages.DASHBOARD}`,
          auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            transaction_amount: 5900,
            currency_id: "COP",
          },
          payer_email:
            env.NODE_ENV === "development"
              ? env.MERCADOPAGO_PAYER_EMAIL ?? ""
              : ctx.session.user.email,
          external_reference: `${cuid2.createId()}:${ctx.session.user.id}:${
            input.subscriptionType
          }`,
          reason: "Suscripción a Deudamigo",
        } satisfies CreateSubscriptionRequestBody;

        const response = await fetch(
          "https://api.mercadopago.com/preapproval",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
            },
            method: "POST",
            body: JSON.stringify(subscription),
          }
        );

        if (!response.ok) {
          throw await response.json();
        }

        const json = (await response.json()) as CreateSubscriptionResponse;
        logger.dev(json.init_point, json.id);

        return {
          paymentLink: json.init_point,
        };
      } catch (error) {
        logger.error(error);
        if (error instanceof z.ZodError) {
          throw CUSTOM_EXCEPTIONS.INTERNAL_SERVER_ERROR(
            "Malformed Payment Link URL"
          );
        }
        throw CUSTOM_EXCEPTIONS.INTERNAL_SERVER_ERROR(
          "Something went wrong at Mercado Pago"
        );
      }
    }),
  cancelSubscription: TRPCProcedures.verified.mutation(async ({ ctx }) => {
    if (!ctx.session.user.subscription?.isActive) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No active subscription found");
    }

    try {
      const body = {
        id: ctx.session.user.subscription.id,
        status: "cancelled",
      } satisfies UpdateSubscriptionRequestBody;

      const response = await fetch(
        `${env.MERCADOPAGO_URL}/preapproval/${body.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw await response.json();
      }

      const json = (await response.json()) as UpdateSubscriptionResponse;
      logger.dev(json);

      return {
        success: true,
      };
    } catch (error) {
      logger.error(error);
      throw CUSTOM_EXCEPTIONS.INTERNAL_SERVER_ERROR(
        "Something went wrong at Mercado Pago"
      );
    }
  }),
});
