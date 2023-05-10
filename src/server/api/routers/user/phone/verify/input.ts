import { z } from "zod";
import { sendPhoneCodeInput } from "$/server/api/routers/user/phone/send-code/input";

export const verifyPhoneInput = sendPhoneCodeInput.merge(
  z.object({
    otp: z
      .string()
      .trim()
      .regex(/^[0-9]{4}$/, {
        message: "El código debe ser de 4 dígitos",
      }),
  })
);
export type VerifyPhoneInput = z.infer<typeof verifyPhoneInput>;
