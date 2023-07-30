import { type SubscriptionType, type User } from "@prisma/client";

export type UserId = User["id"];
export type SubscriptionId = keyof typeof SubscriptionType;
type CUID2 = string;
export type ExternalReference = `${CUID2}:${UserId}:${SubscriptionId}`;
type FrequencyType = "days" | "months";
type CurrencyId = "ARS" | "BRL" | "CLP" | "MXN" | "COP" | "PEN" | "UYU";
type Status = "pending" | "authorized" | "paused" | "cancelled";

// Retrieve a subscription by ID: https://api.mercadopago.com/preapproval/:id
export type GetSubscriptionResponse = {
  id: string;
  version: number;
  application_id: string;
  collector_id: string;
  preapproval_plan_id: string;
  reason: string;
  external_reference: ExternalReference;
  back_url: string;
  init_point: string;
  auto_recurring: {
    frequency: number;
    frequency_type: FrequencyType;
    start_date: string;
    end_date: string;
    currency_id: CurrencyId;
    transaction_amount: number;
    free_trial: {
      frequency: number;
      frequency_type: FrequencyType;
    } | null;
  };
  first_invoice_offset: number | null;
  payer_id: string;
  card_id: string;
  payment_method_id: string;
  next_payment_date?: string;
  date_created: string;
  last_modified: string;
  status: Status;
  summarized: {
    quotas: number | null;
    charged_quantity: number | null;
    charged_amount: number | null;
    pending_charged_quantity: number | null;
    pending_charged_amount: number | null;
    last_charged_date: string | null;
    last_charged_amount: number | null;
    semaphore: "green" | "yellow" | "red" | "blank" | null;
  };
};

// Create a subscription: https://api.mercadopago.com/preapproval (POST)
export type CreateSubscriptionRequestBody = {
  // Successful return url. Use this setting to redirect your customers to your site after our checkout. It is only required for subscriptions without a plan.
  back_url: string;
  auto_recurring: {
    // Indicates the frequency value. Along with frequency_type they define the invoice cycle that a subscription will have.
    frequency: number;
    // Indicates the type of frequency. Along with frequency they define the invoice cycle that a subscription will have.
    frequency_type: FrequencyType;
    // Date from which the subscription will be active, and we start collecting invoices. It is important to emphasize that this field only works together with the `end_date` parameter, that is, if `end_date` is not filled in, the `start_date` will not be recognized.
    start_date?: string;
    // Date until which the subscription will be active, and we will stop charging invoices.
    end_date?: string;
    // Amount we will charge on each invoice.
    transaction_amount?: number;
    // ID of the currency used in the payment.
    currency_id: CurrencyId;
  };
  // The card_token_id is a token generated from the form submission with the capture of payment data. When submitting the form, a token is generated that securely represents the card data. To get the card_token_id, see the "Card" section of the Checkout API documentation and follow all the steps up to the "Initialize payment form" section. It is through this form that it will be possible to obtain the card_token_id.
  card_token_id?: string;
  // Reference to sync with your system. This is a free text field to help you with your integration to link the entities. It is only required for subscriptions without a plan.
  external_reference: ExternalReference;
  payer_email: string;
  // Unique subscription plan identifier. This is an optional field. Our model supports creating subscriptions with or without a plan. If you create a subscription with plan we will take the recurring settings from the plan to create the subscription. When you edit the plan we will update the subscriptions. Decide your best model depending on your business.
  preapproval_plan_id?: string;
  // It is a short description that the subscriber will see during the checkout process and in the notifications. It is only required for subscriptions without a plan.
  reason: string;
  // When you create a subscription, you can make it pending or authorized. Authorized status requires you to indicate a payment method. A pending subscription is waiting for a payment method, that the customer can load into our checkout or by your integration tokenizing a card and adding it to the subscription.
  status?: "pending" | "authorized";
};

// Create a subscription response: https://api.mercadopago.com/preapproval (POST)
export type CreateSubscriptionResponse = {
  // Unique identifier of the subscription.
  id: number;
  // How many times the subscription was modified.
  version: number;
  // Unique ID that identifies your application/integration. One of the keys in the pair that make up the credentials that identify an application/integration in your account.
  application_id: number;
  // Unique ID that identifies your user as a seller. This ID matches your User ID in our ecosystem.
  collector_id: number;
  // Unique plan identifier.
  preapproval_plan_id: string;
  // It is a short description that the subscriber will see during the checkout process and in the notifications. It is only required for subscriptions without a plan.
  reason: string;
  // Reference to sync with your system. This is a free text field to help you with your integration to link the entities.
  external_reference: ExternalReference;
  // Successful return URL. Use this setting to redirect your customers to your site after our checkout.
  back_url: string;
  // URL to check out to add or modify payment method.
  init_point: string;
  // Unique customer identifier. This is created from the email you used to create the subscription.
  payer_id: string;
  // Unique identifier to retrieve data from the card used as a payment method.
  card_id: string;
  // Payment method configured.
  payment_method_id: string;
  // Date of the next payment debit.
  next_payment_date: string;
  date_created: string;
  last_modified: string;
  status: "pending" | "authorized";
};

export type UpdateSubscriptionRequestBody = {
  id: string;
  auto_recurring?: {
    transaction_amount: number;
    currency_id: CurrencyId;
  };
  back_url?: string;
  card_token_id?: string;
  external_reference?: ExternalReference;
  reason?: string;
  status?: Status;
};

export type UpdateSubscriptionResponse = {
  id: string;
  version: number;
  application_id: string;
  collector_id: string;
  preapproval_plan_id: string;
  reason: string;
  external_reference: ExternalReference;
  back_url: string;
  init_point: string;
  auto_recurring: {
    frequency: number;
    frequency_type: FrequencyType;
    start_date: string;
    end_date: string;
    currency_id: CurrencyId;
    transaction_amount: number;
    free_trial: {
      frequency: number;
      frequency_type: FrequencyType;
    } | null;
  };
  first_invoice_offset: number | null;
  payer_id: string;
  card_id: string;
  payment_method_id: string;
  next_payment_date: string;
  date_created: string;
  last_modified: string;
  summarized: {
    quotas: number | null;
    charged_quantity: number | null;
    charged_amount: number | null;
    pending_charged_quantity: number | null;
    pending_charged_amount: number | null;
    last_charged_date: string | null;
    last_charged_amount: number | null;
    semaphore: "green" | "yellow" | "red" | "blank" | null;
  };
  status: Status;
};
