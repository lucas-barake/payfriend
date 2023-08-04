import { TRPCProcedures } from "$/server/api/trpc";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries";
import { borrowerDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-shared-debts/input";
import { DEBTS_QUERY_PAGINATION_LIMIT } from "$/server/api/routers/debts/queries/handlers/lib/constants";

export const getSharedDebts = TRPCProcedures.protected
  .input(borrowerDebtsQueryInput)
  .query(async ({ ctx, input }) => {
    const [debts, count] = await ctx.prisma.$transaction([
      ctx.prisma.debt.findMany({
        where: {
          ...((input.status === "archived" || input.status === "active") && {
            archived: input.status === "archived",
          }),
          borrowers: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        orderBy: [
          {
            createdAt: input.sort,
          },
        ],
        take: DEBTS_QUERY_PAGINATION_LIMIT,
        skip: input.skip,
        select: {
          ...getUserDebtsSelect,
        },
      }),
      ctx.prisma.debt.count({
        where: {
          ...((input.status === "archived" || input.status === "active") && {
            archived: input.status === "archived",
          }),
          lenderId: ctx.session.user.id,
        },
      }),
    ]);

    return {
      debts,
      count,
    };
  });
