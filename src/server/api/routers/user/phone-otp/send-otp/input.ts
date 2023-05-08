import { z } from "zod";
import { parsePhoneNumber } from "libphonenumber-js";

export const sendPhoneOtpInput = z
  .object({
    phone: z.string(),
    countryCode: z.union([z.literal("CO"), z.literal("US"), z.literal("MX")], {
      invalid_type_error: "El código de país no es válido",
    }),
  })
  .superRefine((val, ctx) => {
    const phoneNumber = parsePhoneNumber(val.phone, val.countryCode);
    if (!phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El número de teléfono no es válido",
        path: ["phone"],
      });
    }

    if (!phoneNumber.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El número de teléfono no es válido",
        path: ["phone"],
      });
    }

    return val;
  });
export type SendPhoneOtpInput = z.infer<typeof sendPhoneOtpInput>;
