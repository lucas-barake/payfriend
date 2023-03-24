import { TRPCError } from "@trpc/server";

function handleMainError(error: unknown): void {
  if (error instanceof TRPCError) throw error;
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Ocurrió un error inesperado",
  });
}

export default handleMainError;
