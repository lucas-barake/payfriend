import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";

export const getPaymentsAsBorrower = TRPCProcedures.protected
  .input(
    z.object({
      debtId: z.string().uuid(),
    })
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.payment.findMany({
      where: {
        debtId: input.debtId,
        borrowerId: ctx.session.user.id,
      },
      select: {
        id: true,
        status: true,
        amount: true,
        createdAt: true,
        debt: {
          select: {
            currency: true,
          },
        },
      },
    });
  });
