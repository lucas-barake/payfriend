import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import { z } from "zod";
import { env } from "$/env.mjs";
import { generateLinkInput } from "$/server/api/routers/transactions/payment-link/mutations/input";
import customExceptions from "$/server/api/custom-exceptions";
import { type GenerateLinkReqBody } from "$/server/api/routers/transactions/payment-link/mutations/schemas";
import { DateTime } from "luxon";

export const transactionsMutations = createTRPCRouter({
  generateLink: protectedVerifiedProcedure
    .input(generateLinkInput)
    .mutation(async ({ ctx }) => {
      const body = {
        amount_in_cents: 75000,
        currency: "COP",
        collect_shipping: false,
        name: "Payfriend Plan Premium",
        description: "Payfriend Plan Premium 1 mes",
        expires_at: DateTime.now()
          .plus({
            minutes: 5,
          })
          .toUTC()
          .toISO(),
        sku: `${ctx.session.user.id}:1`,
        single_use: true,
        redirect_url: "localhost:3000/dashboard",
        image_url: null,
      } satisfies GenerateLinkReqBody;

      const response = await fetch(
        "https://sandbox.wompi.co/v1/payment_links",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.WOMPI_PRIVATE_KEY}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data: unknown = await response.json();
      const url = z.string().url().safeParse(data);

      if (!url.success) {
        throw customExceptions.INTERNAL_SERVER_ERROR(
          "Something went wrong at Wompi - Malformed URL"
        );
      }

      return url.data;
    }),
});
