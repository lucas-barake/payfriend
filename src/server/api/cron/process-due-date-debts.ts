import { type NextApiRequest, type NextApiResponse } from "next";
import { logger } from "$/server/logger";
import { z } from "zod";
import { env } from "$/env.mjs";
import { prisma } from "$/server/db";
import { DateTime } from "luxon";
import { PaymentStatus } from "@prisma/client";

export async function processDueDateDebtsCronJob(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  logger.info("PROCESS RECURRENT DEBTS CRON JOB STARTED");
  try {
    z.object({
      key: z.literal(env.CRON_JOB_KEY),
    }).parse(req.query);

    const allDebtsWithDueDate = await prisma.debt.findMany({
      where: {
        dueDate: {
          not: null,
        },
        archived: false,
      },
      select: {
        id: true,
        dueDate: true,
        amount: true,
        borrowers: {
          select: {
            balance: true,
            userId: true,
            payments: {
              select: {
                id: true,
                status: true,
                amount: true,
              },
            },
          },
        },
      },
    });

    for (const debt of allDebtsWithDueDate) {
      if (debt.dueDate === null) {
        logger.error(`Debt ${debt.id} has null dueDate`);
        continue;
      }

      const dueDate = DateTime.fromJSDate(debt.dueDate);
      const isOverdue = dueDate.plus({ days: 1 }) < DateTime.now();

      if (!isOverdue) {
        logger.info(`Debt ${debt.id} is not overdue`);
        continue;
      }

      for (const borrower of debt.borrowers) {
        await prisma.$transaction(async (prisma) => {
          const balance = borrower.balance;
          const hasDueAmount = balance !== 0;
          if (hasDueAmount) {
            const payment = await prisma.payment.create({
              data: {
                amount: balance,
                status: PaymentStatus.MISSED,
                debtId: debt.id,
                borrowerId: borrower.userId,
              },
            });
            logger.info(`Payment ${payment.id} created`);
          }
        });
      }

      await prisma.pendingInvite.deleteMany({
        where: {
          debtId: debt.id,
        },
      });
      logger.info(`Pending invites for debt ${debt.id} deleted`);

      await prisma.debt.update({
        where: {
          id: debt.id,
        },
        data: {
          archived: true,
        },
      });
      logger.info(`Debt ${debt.id} archived`);
    }
  } catch (e) {
    logger.error("Invalid cron job key");
    res.status(401).send({
      message: "Unauthorized",
    });
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }

  logger.info("PROCESSING RECURRENT DEBTS CRON JOB FINISHED");
  res.status(200).send({
    message: "Ok",
  });
}
