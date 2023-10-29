import { TRPCProcedures } from "$/server/api/trpc";
import { getUserDebtsSelect } from "$/server/api/routers/debts/get-debts/subrouter";
import { debtsAsBorrowerInput } from "$/server/api/routers/debts/get-debts/debts-as-borrower/input";
import { DEBTS_QUERY_PAGINATION_LIMIT } from "$/server/api/routers/debts/get-debts/(lib)/constants";
import { PaymentStatus, Prisma } from "@prisma/client";
import DebtWhereInput = Prisma.DebtWhereInput;

export const getSharedDebts = TRPCProcedures.protected
  .input(debtsAsBorrowerInput)
  .query(async ({ ctx, input }) => {
    const where = {
      ...(input.status === "archived" && {
        archived: {
          not: {
            equals: null,
          },
        },
      }),
      ...(input.partnerEmail && {
        lender: {
          email: input.partnerEmail,
        },
      }),
      borrowers: {
        some: {
          userId: ctx.session.user.id,
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
    } satisfies DebtWhereInput;

    const [debts, count] = await ctx.prisma.$transaction([
      ctx.prisma.debt.findMany({
        where,
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
        where,
      }),
    ]);

    return {
      debts,
      count,
    };
  });
