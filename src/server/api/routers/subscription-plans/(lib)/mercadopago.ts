import mercadopago from "mercadopago";
import { env } from "$/env.mjs";

mercadopago.configure({
  access_token: env.MERCADOPAGO_ACCESS_TOKEN,
});

export default mercadopago;
