import { z } from "zod";

export const verifyOTPInput = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^[0-9]{4}$/, {
      message: "El código debe ser de 4 dígitos",
    }),
});
export type VerifyOTPInput = z.infer<typeof verifyOTPInput>;
