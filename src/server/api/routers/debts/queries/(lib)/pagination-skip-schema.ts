import { z } from "zod";

export const paginationSkipSchema = z.number().int().gte(0);
