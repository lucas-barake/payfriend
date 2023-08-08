import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const removePayment = TRPCProcedures.protected
  .input(
    z.object({
      paymentId: z.string().uuid(),
      debtId: z.string().uuid(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const payment = await ctx.prisma.payment.findFirst({
      where: {
        id: input.paymentId,
        borrowerId: ctx.session.user.id,
        status: "PENDING_CONFIRMATION",
      },
      select: {
        id: true,
        amount: true,
        borrower: {
          select: {
            balance: true,
            debtId: true,
          },
        },
      },
    });

    if (!payment) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No se encontró el pago");
    }

    await ctx.prisma.$transaction(async (prisma) => {
      await prisma.payment.delete({
        where: {
          id: payment.id,
        },
      });

      await ctx.prisma.borrower.update({
        where: {
          userId_debtId: {
            userId: ctx.session.user.id,
            debtId: input.debtId,
          },
        },
        data: {
          balance: {
            increment: payment.amount,
          },
        },
      });
    });

    return true;
  });
