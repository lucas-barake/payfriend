import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const getDebtBorrowersAndPendingBorrowers = TRPCProcedures.verified
  .input(
    z.object({
      debtId: z.string().uuid(),
    })
  )
  .query(async ({ ctx, input }) => {
    const debt = await ctx.prisma.debt.findFirst({
      where: {
        id: input.debtId,
        lenderId: ctx.session.user.id,
      },
      select: {
        id: true,
        borrowers: {
          select: {
            id: true,
            status: true,
            user: {
              select: {
                id: true,
                email: true,
                image: true,
                name: true,
              },
            },
          },
        },
        pendingInvites: {
          select: {
            inviteeEmail: true,
          },
        },
      },
    });

    if (!debt) {
      throw CUSTOM_EXCEPTIONS.NOT_FOUND("No se encontró la deuda");
    }

    return {
      borrowers: debt.borrowers,
      pendingBorrowers: debt.pendingInvites,
    };
  });
