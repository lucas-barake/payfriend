import { protectedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import { verifyOTPInput } from "$/server/api/routers/user/mutations/verifyOTP/input";

const verifyOTPHandler = protectedProcedure
  .input(verifyOTPInput)
  .mutation(async ({ input, ctx }) => {
    try {
      if (ctx.session.user.emailVerified != null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El email ya está verificado",
        });
      }

      const userQuery = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          otp: true,
          otpUpdatedAt: true,
        },
      });

      if (!userQuery) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No se encontró el usuario",
        });
      }

      if (userQuery.otp == null || userQuery.otpUpdatedAt == null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error al verificar el código",
        });
      }

      if (userQuery.otp !== input.otp) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El código es inválido",
        });
      }

      const now = new Date();
      const diff = Math.abs(now.getTime() - userQuery.otpUpdatedAt.getTime());
      const minutes = Math.floor(diff / 1000 / 60);
      const hasFifteenMinutesPassed = minutes >= 15;

      if (hasFifteenMinutesPassed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El código expiró. Solicita uno nuevo.",
        });
      }

      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          otp: null,
          otpUpdatedAt: null,
          emailVerified: DateTime.now().toUTC().toISO(),
        },
      });

      return true;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Algo salió mal",
      });
    }
  });

export default verifyOTPHandler;
