import { z } from "zod";
import { sendPhoneOtpInput } from "$/server/api/routers/user/phone/otp/send-phone-otp/input";

export const verifyPhoneInput = sendPhoneOtpInput.merge(
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
