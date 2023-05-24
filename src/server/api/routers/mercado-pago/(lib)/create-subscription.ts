import { z } from "zod";

const autoRecurringSchema = z.object({
  /**
   * Indicates the value of the frequency.
   * Together with frequency_type they define the billing cycle a subscription will have.
   * */
  frequency: z.number(),
  /**
   * Indicates the type of frequency. Together with frequency they define the billing cycle a subscription will have.
   */
  frequency_type: z.union([z.literal("months"), z.literal("days")]),
  /**
   * It is optional and is used to create a limited subscription. It indicates the number of times we will repeat the recurrence cycle.
   * If this parameter is not defined, the subscription does not end until one of the parties cancels it.
   */
  repetitions: z.number().optional(),
  /**
   * Day of the month in which the subscription will be charged. Only accepts values between 1 and 28.
   * This setting is only available for subscriptions with an associated plan.
   */
  billing_day: z.number().min(1).max(28).optional(),
  /**
   * Charges an amount proportional to the billing day at the time of registration.
   * @true: Charge a proportional amount based on the days remaining in the next billing cycle. Billing cycles are always calculated on a 30-day basis.
   * @false: Charge the amount of the subscription regardless of when in the billing cycle customer subscribe.
   */
  billing_day_proportional: z.boolean().optional(),
  free_trial: z
    .object({
      /**
       * Indicates the value of the frequency. Together with frequency_type they define the billing cycle a subscription will have.
       * */
      frequency: z.number(),
      /**
       * Indicates the type of frequency. Together with frequency they define the billing cycle a subscription will have.
       */
      frequency_type: z.union([z.literal("months"), z.literal("days")]),
    })
    .optional(),
  // Amount to be charged on each invoice.
  transaction_amount: z.number().optional(),
  currency_id: z.union([
    z.literal("ARS"),
    z.literal("BRL"),
    z.literal("CLP"),
    z.literal("MXN"),
    z.literal("COP"),
    z.literal("PEN"),
    z.literal("UYU"),
  ]),
});

export const createSubscriptionSchema = z.object({
  auto_recurring: autoRecurringSchema,
  /**
   * Successful return URL.
   * Use this configuration to redirect your customers to your site after our checkout.
   * */
  back_url: z.string(),
  // A brief description that the subscriber will see during checkout and in notifications.
  reason: z.string(),
  status: z.union([z.literal("pending"), z.literal("authorized")]),
  payer_email: z.string().email(),
});
export type CreateSubscriptionSchema = z.infer<typeof createSubscriptionSchema>;

export type CreateSubscriptionJSONResponse = {
  id: string;
  application_id: number;
  collector_id: number;
  reason: string;
  auto_recurring: CreateSubscriptionSchema["auto_recurring"];
  external_reference: string;
  init_point: string;
  date_created: string;
  last_modified: string;
  status: string;
};
