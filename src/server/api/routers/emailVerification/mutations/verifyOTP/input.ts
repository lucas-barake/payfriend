import { z } from "zod";

export const verifyOTPInput = z.object({
  otp: z
    .number()
    .int({
      message: "El código debe ser un número entero",
    })
    .refine((v) => String(v).length === 4, {
      message: "El código debe tener 4 dígitos",
    }),
});
export type VerifyOTPInput = z.infer<typeof verifyOTPInput>;
