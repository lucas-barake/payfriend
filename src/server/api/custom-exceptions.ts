import { TRPCError } from "@trpc/server";

const CUSTOM_EXCEPTIONS = {
  UNAUTHORIZED: () => {
    return new TRPCError({
      code: "UNAUTHORIZED",
      message: "No tienes permisos para realizar esta acción",
    });
  },
  BAD_REQUEST: (message?: string) => {
    return new TRPCError({
      code: "BAD_REQUEST",
      message: message ?? "Ocurrió algún error.",
    });
  },
  INTERNAL_SERVER_ERROR: (message?: string) => {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: message ?? "Ocurrió algún error.",
    });
  },
  NOT_FOUND: (message?: string) => {
    return new TRPCError({
      code: "NOT_FOUND",
      message: message ?? "No encontrado.",
    });
  },
  TOO_MANY_REQUESTS: (message?: string) => {
    return new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: message ?? "Demasiadas solicitudes. Espera un momento.",
    });
  },
};

export default CUSTOM_EXCEPTIONS;
