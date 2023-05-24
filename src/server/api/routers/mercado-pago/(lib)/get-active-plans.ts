import { env } from "$/env.mjs";

type AutoRecurring = {
  frequency: number;
  currency_id: string;
  transaction_amount: number;
  frequency_type: string;
};

type JSONResponse = {
  paging: {
    offset: number;
    limit: number;
    total: number;
  };
  results: Array<{
    reason: string;
    status: string;
    subscribed: number;
    back_url: string;
    auto_recurring: AutoRecurring;
    id: string;
    date_created: string;
    collector_id: number;
    init_point: string;
    last_modified: string;
    external_reference?: string;
    application_id: number;
  }>;
};

export const getActivePlans = async () => {
  const URL = "https://api.mercadopago.com/preapproval_plan/search";

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
    },
  });

  const data = (await response.json()) as JSONResponse;

  return data;
};
