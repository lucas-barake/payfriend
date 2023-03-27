import { z } from "zod";

export const updateDeleteUserOptions = [
  { value: "VIEWER", label: "Solo ver" },
  { value: "COLLABORATOR", label: "Ver y editar" },
  { value: "REMOVE", label: "Eliminar usuario" },
] as const;
export type UpdateDeleteUserValueOptions =
  (typeof updateDeleteUserOptions)[number]["value"];

export const updateUserRoleInput = z.object({
  groupId: z.string().cuid(),
  userId: z.string().cuid(),
  role: z.enum(["VIEWER", "COLLABORATOR"]),
});
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleInput>;
