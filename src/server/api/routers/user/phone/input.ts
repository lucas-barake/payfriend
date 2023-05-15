import { z } from "zod";
import { parsePhoneNumber } from "libphonenumber-js/min";
import { format } from "libphonenumber-js";
import { countriesWithCodes } from "$/pages/onboarding/(page-lib)/lib/countries-with-codes";
import { createManyUnion } from "$/lib/utils/zod/create-union-schema";
import { strTransformer } from "$/lib/utils/str-transformer";

const countryCodes = countriesWithCodes.map((c) => c.code_2);
const countryCode = createManyUnion(
  countryCodes as typeof countryCodes & [string, string, ...string[]],
  {
    required_error: "Debes seleccionar un código de país",
    invalid_type_error: "Debes seleccionar un código de país válido",
  }
);

export const sendPhoneCodeInput = z.object({
  phone: z
    .object({
      phoneNumber: z
        .string()
        .trim()
        .min(2, { message: "El número de teléfono no es válido" }),
      countryCode,
    })
    .refine((v) => {
      const phoneNumber = parsePhoneNumber(v.phoneNumber, v.countryCode);

      if (!phoneNumber) {
        return false;
      }

      return phoneNumber.isValid();
    })
    .transform((v) => ({
      phoneNumber: strTransformer.removeWhitespace(
        format(v.phoneNumber, v.countryCode, "INTERNATIONAL")
      ),
      countryCode: v.countryCode,
    })),
});
export type SendPhoneCodeInput = z.infer<typeof sendPhoneCodeInput>;

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
