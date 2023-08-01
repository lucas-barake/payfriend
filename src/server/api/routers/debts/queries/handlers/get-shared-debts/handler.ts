import { TRPCProcedures } from "$/server/api/trpc";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries";
import { paginationInput } from "$/server/api/routers/debts/queries/lib/shared-input";

export const getSharedDebts = TRPCProcedures.protected
  .input(paginationInput)
  .query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        debtsAsBorrower: {
          select: {
            debt: {
              select: getUserDebtsSelect,
            },
          },
          take: input.limit,
          skip: input.skip,
          orderBy: [
            {
              debt: {
                createdAt: "desc",
              },
            },
            {
              debt: {
                archived: "asc",
              },
            },
          ],
        },
        _count: {
          select: {
            debtsAsBorrower: true,
          },
        },
      },
    });
  });
