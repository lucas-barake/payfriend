import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";
import { BorrowerStatus } from "@prisma/client";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const getPendingConfirmations = TRPCProcedures.verified
  .input(
    z.object({
      debtId: z.string().uuid(),
    })
  )
  .query(async ({ ctx, input }) => {
    const pendingConfirmations = await ctx.prisma.debt
      .findFirst({
        where: {
          id: input.debtId,
          lenderId: ctx.session.user.id,
        },
      })
      .borrowers({
        where: {
          status: BorrowerStatus.PENDING_CONFIRMATION,
        },
        select: {
          user: {
            select: {
              id: true,
              email: true,
              image: true,
            },
          },
        },
      });

    if (!pendingConfirmations) {
      throw CUSTOM_EXCEPTIONS.NOT_FOUND("No se encontró la deuda");
    }

    return {
      pendingConfirmations,
    };
  });
