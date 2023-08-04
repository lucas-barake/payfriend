import { TRPCProcedures } from "$/server/api/trpc";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries";
import { BorrowerStatus } from "@prisma/client";
import { lenderDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-owned-debts/input";
import { DEBTS_QUERY_PAGINATION_LIMIT } from "$/server/api/routers/debts/queries/handlers/lib/constants";

export const getOwnedDebts = TRPCProcedures.protected
  .input(lenderDebtsQueryInput)
  .query(async ({ ctx, input }) => {
    const [debts, count] = await ctx.prisma.$transaction([
      ctx.prisma.debt.findMany({
        where: {
          ...((input.status === "archived" || input.status === "active") && {
            archived: input.status === "archived",
          }),
          lenderId: ctx.session.user.id,
          borrowers:
            input.status === "pending-confirmation"
              ? {
                  some: {
                    status: {
                      equals: BorrowerStatus.PENDING_CONFIRMATION,
                    },
                  },
                }
              : undefined,
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
          borrowers:
            input.status === "pending-confirmation"
              ? {
                  some: {
                    status: {
                      equals: BorrowerStatus.PENDING_CONFIRMATION,
                    },
                  },
                }
              : undefined,
        },
      }),
    ]);

    return {
      debts,
      count,
    };
  });
