import { z } from "zod";

export const getAllCollaboratorsInput = z.string().cuid();
export type GetAllCollaboratorsInput = z.infer<typeof getAllCollaboratorsInput>;
