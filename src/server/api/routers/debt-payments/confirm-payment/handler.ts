import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { PaymentStatus } from "@prisma/client";

export const confirmPayment = TRPCProcedures.protected
  .input(
    z.object({
      debtId: z.string().uuid(),
      borrowerId: z.string().uuid(),
      paymentId: z.string().uuid(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const debt = await ctx.prisma.debt.findUnique({
      where: {
        id: input.debtId,
        lenderId: ctx.session.user.id,
        borrowers: {
          some: {
            userId: input.borrowerId,
          },
        },
        archived: {
          equals: null,
        },
        payments: {
          some: {
            id: input.paymentId,
            status: PaymentStatus.PENDING_CONFIRMATION,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!debt) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("Debt not found");
    }

    return ctx.prisma.payment.update({
      where: {
        id: input.paymentId,
        debtId: input.debtId,
        borrowerId: input.borrowerId,
        status: PaymentStatus.PENDING_CONFIRMATION,
      },
      data: {
        status: PaymentStatus.PAID,
      },
    });
  });
