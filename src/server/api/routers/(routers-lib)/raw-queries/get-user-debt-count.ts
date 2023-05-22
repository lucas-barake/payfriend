import { type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { type Session } from "next-auth";

export const debtsCountResult = z.tuple([
  z.object({
    lenderDebtsCount: z.number({
      coerce: true,
    }),
    borrowerDebtsCount: z.number({
      coerce: true,
    }),
  }),
]);
export type DebtsCountResult = z.infer<typeof debtsCountResult>;

export async function getUserDebtCount(
  prisma: PrismaClient,
  userId: Session["user"]["id"]
): Promise<{
  lenderDebtsCount: number;
  borrowerDebtsCount: number;
}> {
  const debtsCount = await prisma.$queryRaw`
      SELECT (SELECT COUNT(*) FROM "Debt" WHERE "lenderId" = ${userId})   AS "lenderDebtsCount",
             (SELECT COUNT(*) FROM "Borrower" WHERE "userId" = ${userId}) AS "borrowerDebtsCount"
  `;
  const result = z
    .tuple([
      z.object({
        lenderDebtsCount: z.number({
          coerce: true,
        }),
        borrowerDebtsCount: z.number({
          coerce: true,
        }),
      }),
    ])
    .parse(debtsCount);

  return {
    lenderDebtsCount: result[0].lenderDebtsCount,
    borrowerDebtsCount: result[0].borrowerDebtsCount,
  };
}
