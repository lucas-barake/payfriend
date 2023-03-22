import { protectedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import { verifyOTPInput } from "$/server/api/routers/emailVerification/mutations/verifyOTP/input";

const verifyOTPHandler = protectedProcedure
  .input(verifyOTPInput)
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.emailVerified != null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email already verified",
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
        message: "User not found",
      });
    }

    if (userQuery.otp == null || userQuery.otpUpdatedAt == null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "OTP not found",
      });
    }

    if (userQuery.otp !== input.otp) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "OTP invalid",
      });
    }

    const now = new Date();
    const diff = Math.abs(now.getTime() - userQuery.otpUpdatedAt.getTime());
    const minutes = Math.floor(diff / 1000 / 60);
    const hasFifteenMinutesPassed = minutes >= 15;

    if (hasFifteenMinutesPassed) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "OTP expired",
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
  });

export default verifyOTPHandler;
