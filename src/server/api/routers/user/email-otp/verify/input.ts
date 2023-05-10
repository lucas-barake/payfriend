import { z } from "zod";

export const verifyEmailInput = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^[0-9]{4}$/, {
      message: "El código debe ser de 4 dígitos",
    }),
});
export type VerifyEmailInput = z.infer<typeof verifyEmailInput>;
