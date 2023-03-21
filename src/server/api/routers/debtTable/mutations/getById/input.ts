import { z } from "zod";

export const getDebtTableByIdInput = z
  .string({
    invalid_type_error: "El id debe ser un string",
  })
  .trim()
  .cuid({
    message: "El id debe ser un cuid",
  });
export type GetDebtTableByIdInput = z.infer<typeof getDebtTableByIdInput>;