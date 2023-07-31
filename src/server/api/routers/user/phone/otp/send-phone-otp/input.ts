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

export const sendPhoneOtpInput = z.object({
  phone: z
    .object({
      phoneNumber: z
        .string()
        .trim()
        .min(2, { message: "El número de teléfono no es válido" }),
      countryCode,
    })
    .refine(
      (v) => {
        const phoneNumber = parsePhoneNumber(v.phoneNumber, v.countryCode);

        if (!phoneNumber) {
          return false;
        }

        return phoneNumber.isValid();
      },
      {
        message: "El número de celular no es válido",
      }
    )
    .transform((v) => ({
      phoneNumber: strTransformer.removeWhitespace(
        format(v.phoneNumber, v.countryCode, "INTERNATIONAL")
      ),
      countryCode: v.countryCode,
    })),
});
export type SendPhoneOtpInput = z.infer<typeof sendPhoneOtpInput>;
