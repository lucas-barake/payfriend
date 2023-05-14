import { TRPCError } from "@trpc/server";

const CUSTOM_EXCEPTIONS = {
  UNAUTHORIZED: () => {
    return new TRPCError({
      code: "UNAUTHORIZED",
      message: "No tienes permisos para realizar esta acción",
    });
  },
  BAD_REQUEST: (message?: string) => {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: message ?? "Ocurrió algún error.",
    });
  },
  INTERNAL_SERVER_ERROR: (message?: string) => {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: message ?? "Ocurrió algún error.",
    });
  },
};

export default CUSTOM_EXCEPTIONS;
