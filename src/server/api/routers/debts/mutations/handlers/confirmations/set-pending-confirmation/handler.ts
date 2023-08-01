import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const setPendingConfirmation = TRPCProcedures.protected
  .input(
    z.object({
      debtId: z.string().uuid(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const debt = await ctx.prisma.debt.findFirst({
      where: {
        id: input.debtId,
        archived: false,
        borrowers: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
    });

    if (!debt) {
      throw CUSTOM_EXCEPTIONS.NOT_FOUND("Deuda no encontrada");
    }

    return ctx.prisma.borrower.update({
      where: {
        userId_debtId: {
          debtId: debt.id,
          userId: ctx.session.user.id,
        },
      },
      data: {
        status: "PENDING_CONFIRMATION",
      },
    });
  });
