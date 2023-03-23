import { z } from "zod";

export const getAllGroupMembersInput = z.string().cuid();
export type GetAllGroupMembersInput = z.infer<typeof getAllGroupMembersInput>;
