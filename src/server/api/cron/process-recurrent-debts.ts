import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { logger } from "$/server/logger";
import { prisma } from "$/server/db";
import { DateTime } from "luxon";
import { PaymentStatus } from "@prisma/client";
import { env } from "$/env.mjs";

export async function processRecurrentDebtsCronJob(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  logger.info("PROCESS RECURRENT DEBTS CRON JOB STARTED");
  try {
    z.object({
      key: z.literal(env.CRON_JOB_KEY),
    }).parse(req.query);

    const allRecurrentDebts = await prisma.debt.findMany({
      where: {
        recurringFrequency: {
          not: null,
        },
        duration: {
          not: null,
        },
        archived: false,
      },
      select: {
        id: true,
        duration: true,
        recurringFrequency: true,
        createdAt: true,
        processedAt: true,
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

    for (const debt of allRecurrentDebts) {
      if (debt.duration === null || debt.recurringFrequency === null) {
        logger.error(`Debt ${debt.id} has null duration or recurringFrequency`);
        continue;
      }

      const processedAt = debt.processedAt ?? debt.createdAt;

      const processedAtPlusRecurrentFrequency = DateTime.fromJSDate(
        processedAt
      ).plus({
        month:
          debt.recurringFrequency === "MONTHLY"
            ? 1
            : debt.recurringFrequency === "WEEKLY"
            ? 1 / 4
            : // BIWEEKLY
              1 / 2,
      });

      const lastPeriod = DateTime.fromJSDate(debt.createdAt).plus({
        month:
          debt.recurringFrequency === "MONTHLY"
            ? debt.duration
            : debt.recurringFrequency === "WEEKLY"
            ? debt.duration / 4
            : // BIWEEKLY
              debt.duration / 2,
      });
      const isLastPeriodOver = lastPeriod < DateTime.now();

      const isProcessedAtPlusRecurrentFrequencyGreaterThanNow =
        processedAtPlusRecurrentFrequency > DateTime.now();

      if (isProcessedAtPlusRecurrentFrequencyGreaterThanNow) {
        logger.info(`Debt ${debt.id} is not due yet`);
        continue;
      }

      // reset all borrowers' balances to the debt amount. If they have a due amount that is not paid (so the balance is not 0), then create a new payment with the same amount and status as PaymentStatus.MISSED and set the balance to the debt amount + the amount of the missed payment.
      for (const borrower of debt.borrowers) {
        await prisma.$transaction(async (prisma) => {
          const balance = borrower.balance;
          const hasDueAmount = balance !== 0;
          if (hasDueAmount) {
            await prisma.payment.create({
              data: {
                amount: balance,
                borrowerId: borrower.userId,
                debtId: debt.id,
                status: PaymentStatus.MISSED,
              },
            });
            logger.info(
              `Created missed payment for borrower ${borrower.userId} for debt ${debt.id}`
            );
          }

          if (isLastPeriodOver) {
            const pendingPayments = borrower.payments.filter(
              (payment) => payment.status === PaymentStatus.PENDING_CONFIRMATION
            );

            for (const payment of pendingPayments) {
              await prisma.payment.update({
                where: {
                  id: payment.id,
                },
                data: {
                  status: PaymentStatus.MISSED,
                },
              });
              logger.info(`Marked payment ${payment.id} as missed`);
            }

            const pendingPaymentsAmount = pendingPayments.reduce(
              (acc, curr) => acc + curr.amount,
              0
            );

            await prisma.borrower.update({
              where: {
                userId_debtId: {
                  debtId: debt.id,
                  userId: borrower.userId,
                },
              },
              data: {
                balance: balance + pendingPaymentsAmount,
              },
            });

            logger.info(
              `Updated borrower ${borrower.userId} balance for debt ${debt.id}`
            );

            await prisma.debt.update({
              where: {
                id: debt.id,
              },
              data: {
                archived: true,
              },
            });
            logger.info(`Archived debt ${debt.id}`);
            return;
          }

          await prisma.borrower.update({
            where: {
              userId_debtId: {
                debtId: debt.id,
                userId: borrower.userId,
              },
            },
            data: {
              balance: debt.amount + balance,
            },
          });
          logger.info(
            `Updated borrower ${borrower.userId} balance for debt ${debt.id}`
          );
        });
      }

      await prisma.debt.update({
        where: {
          id: debt.id,
        },
        data: {
          processedAt: DateTime.now().toUTC().toISO(),
        },
      });
    }
  } catch (error) {
    logger.error(error);
    if (error instanceof z.ZodError) {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }

  logger.info("PROCESSING RECURRENT DEBTS CRON JOB ENDED");
  res.status(200).json({
    message: "OK",
  });
}
