import { TRPCProcedures } from "$/server/api/trpc";
import { getUserDebtsSelect } from "$/server/api/routers/debts/get-debts/subrouter";
import { debtsAsBorrowerInput } from "$/server/api/routers/debts/get-debts/debts-as-borrower/input";
import { DEBTS_QUERY_PAGINATION_LIMIT } from "$/server/api/routers/debts/get-debts/(lib)/constants";
import { PaymentStatus } from "@prisma/client";

export const getSharedDebts = TRPCProcedures.protected
  .input(debtsAsBorrowerInput)
  .query(async ({ ctx, input }) => {
    const [debts, count] = await ctx.prisma.$transaction([
      ctx.prisma.debt.findMany({
        where: {
          ...(input.status === "active" && {
            archived: false,
          }),
          borrowers: {
            some: {
              userId: ctx.session.user.id,
              ...(input.status === "active" && {
                balance: {
                  gt: 0,
                },
                payments: {
                  some: {
                    status: {
                      equals: PaymentStatus.PENDING_CONFIRMATION,
                    },
                  },
                },
              }),
              ...(input.status === "archived" && {
                balance: {
                  equals: 0,
                },
                payments: {
                  every: {
                    status: {
                      in: [PaymentStatus.PAID, PaymentStatus.MISSED],
                    },
                  },
                },
              }),
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
          borrowers: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      }),
    ]);

    return {
      debts,
      count,
    };
  });
