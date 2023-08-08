import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";

export const getPaymentsAsLender = TRPCProcedures.protected
  .input(
    z.object({
      debtId: z.string().uuid(),
    })
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.debt.findUniqueOrThrow({
      where: {
        id: input.debtId,
        lenderId: ctx.session.user.id,
      },
      select: {
        payments: {
          select: {
            id: true,
            status: true,
            amount: true,
            createdAt: true,
            borrower: {
              select: {
                balance: true,
                user: {
                  select: {
                    id: true,
                    image: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  });
