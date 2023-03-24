import { z } from "zod";

export const getGroupByIdInput = z.object({
  id: z
    .string({
      invalid_type_error: "El id debe ser un string",
    })
    .trim()
    .cuid({
      message: "El id debe ser un cuid",
    }),
});
export type GetGroupByIdInput = z.infer<typeof getGroupByIdInput>;
