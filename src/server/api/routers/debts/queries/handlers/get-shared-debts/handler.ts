import { TRPCProcedures } from "$/server/api/trpc";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries";
import { borrowerDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-shared-debts/input";

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
        take: input.limit ?? 8,
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
