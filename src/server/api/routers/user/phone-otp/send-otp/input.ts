import { z } from "zod";
import { parsePhoneNumber } from "libphonenumber-js/min";
import { format } from "libphonenumber-js";
import { countriesWithCodes } from "$/pages/onboarding/(page-lib)/lib/countries-with-codes";
import { createManyUnion } from "$/lib/utils/zod/create-union-schema";

function addPhoneIssue(ctx: z.RefinementCtx) {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "El número de teléfono no es válido",
    path: ["phone"],
  });
}

const countryCodes = countriesWithCodes.map((c) => c.code_2);
const countryCode = createManyUnion(
  countryCodes as typeof countryCodes & [string, string, ...string[]],
  {
    required_error: "Debes seleccionar un código de país",
    invalid_type_error: "Debes seleccionar un código de país válido",
  }
);

export const sendPhoneOtpInput = z
  .object({
    phone: z
      .string()
      .trim()
      .min(2, { message: "El número de teléfono no es válido" }),
    countryCode,
  })
  .superRefine((val, ctx) => {
    try {
      const phoneNumber = parsePhoneNumber(val.phone, val.countryCode);

      if (!phoneNumber) {
        addPhoneIssue(ctx);
        return z.NEVER;
      }

      if (!phoneNumber.isValid()) {
        addPhoneIssue(ctx);
        return z.NEVER;
      }

      return phoneNumber;
    } catch (e) {
      // parsePhoneNumber for some reason throws an error if the length is less than a certain number
      addPhoneIssue(ctx);
      return z.NEVER;
    }
  })
  .transform((v) => ({
    phone: format(v.phone, v.countryCode, "INTERNATIONAL"),
    countryCode: v.countryCode,
  }));
export type SendPhoneOtpInput = z.infer<typeof sendPhoneOtpInput>;
