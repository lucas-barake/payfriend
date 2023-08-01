import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const rejectPendingConfirmation = TRPCProcedures.protected
  .input(
    z.object({
      debtId: z.string().uuid(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const debt = await ctx.prisma.debt.findFirst({
      where: {
        id: input.debtId,
        lenderId: ctx.session.user.id,
        archived: false,
      },
      select: {
        id: true,
        borrowers: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!debt) {
      throw CUSTOM_EXCEPTIONS.NOT_FOUND("Deuda no encontrada");
    }

    const borrower = debt.borrowers.find(
      (borrower) => borrower.status === "PENDING_CONFIRMATION"
    );

    if (!borrower) {
      throw CUSTOM_EXCEPTIONS.NOT_FOUND("No hay deudores pendientes");
    }

    return ctx.prisma.borrower.update({
      where: {
        id: borrower.id,
      },
      data: {
        status: "YET_TO_PAY",
      },
    });
  });
