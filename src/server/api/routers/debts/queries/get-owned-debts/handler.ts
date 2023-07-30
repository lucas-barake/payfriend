import { TRPCProcedures } from "$/server/api/trpc";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries";
import { paginationInput } from "$/server/api/routers/debts/queries/(shared)/input";

export const getOwnedDebts = TRPCProcedures.verified
  .input(paginationInput)
  .query(async ({ ctx, input }) => {
    const debtsAsLenderQuery = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        debtsAsLender: {
          select: {
            ...getUserDebtsSelect,
          },
          take: input.limit,
          skip: input.skip,
          orderBy: [
            {
              createdAt: "desc",
            },
            {
              archived: "asc",
            },
          ],
        },
        _count: {
          select: {
            debtsAsLender: true,
          },
        },
      },
    });

    return {
      debtsAsLender: debtsAsLenderQuery?.debtsAsLender,
      count: debtsAsLenderQuery?._count?.debtsAsLender,
    };
  });
