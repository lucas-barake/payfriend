import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const archiveDebt = TRPCProcedures.protected
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
      },
    });

    if (!debt) {
      throw CUSTOM_EXCEPTIONS.NOT_FOUND("Deuda no encontrada");
    }

    return ctx.prisma.$transaction(async (prisma) => {
      await prisma.pendingInvite.deleteMany({
        where: {
          debtId: debt.id,
        },
      });

      return prisma.debt.update({
        where: {
          id: debt.id,
        },
        data: {
          archived: true,
        },
      });
    });
  });
