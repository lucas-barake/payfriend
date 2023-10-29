import { TRPCProcedures } from "$/server/api/trpc";
import { z } from "zod";

export const getUniquePartners = TRPCProcedures.protected
  .input(
    z.object({
      role: z.union([z.literal("lender"), z.literal("borrower")]),
    })
  )
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    if (input.role === "lender") {
      const borrowers = await ctx.prisma.borrower.findMany({
        where: {
          debt: {
            lenderId: userId,
          },
        },
        select: {
          user: {
            select: {
              email: true,
              image: true,
              name: true,
            },
          },
        },
        distinct: ["userId"],
      });

      return borrowers.map((borrower) => ({
        email: borrower.user.email,
        image: borrower.user.image,
        name: borrower.user.name,
      }));
    } else {
      const lenders = await ctx.prisma.debt.findMany({
        where: {
          borrowers: {
            some: {
              userId,
            },
          },
        },
        select: {
          lender: {
            select: {
              email: true,
              image: true,
              name: true,
            },
          },
        },
        distinct: ["lenderId"],
      });

      return lenders.map((debt) => ({
        email: debt.lender.email,
        image: debt.lender.image,
        name: debt.lender.name,
      }));
    }
  });
