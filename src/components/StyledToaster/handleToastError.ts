import { TRPCClientError } from "@trpc/client";

function handleToastError(error: unknown, custom?: string): string {
  if (error instanceof Error) return error.message;
  if (error instanceof TRPCClientError) return custom ?? error.message;
  return "Error desconocido";
}

export default handleToastError;
