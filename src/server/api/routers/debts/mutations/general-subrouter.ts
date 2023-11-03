import { createTRPCRouter, TRPCProcedures } from "$/server/api/trpc";
import { createDebtInput } from "$/server/api/routers/debts/mutations/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries/subrouter";
import { checkDebtLimitAndIncr } from "$/server/api/routers/debts/_lib/utils/check-debt-limit-and-incr";
import { sendInvitationEmail } from "$/server/api/routers/debts/_lib/utils/send-invitation-email";
import { checkAndMarkEmailSent } from "$/server/api/routers/debts/_lib/utils/check-and-mark-email-sent";
import { addRecentEmail } from "$/server/api/routers/debts/_lib/utils/stored-recent-emails";
import { DateTime } from "luxon";
import { z } from "zod";

export const generalDebtsSubRouter = createTRPCRouter({
  createDebt: TRPCProcedures.rateLimited({
    maxRequests: 10,
    window: 1,
    windowType: "minutes",
    uniqueId: "create-debt",
  })
    .input(createDebtInput)
    .mutation(async ({ ctx, input }) => {
      if (
        input.borrowerEmails.some((email) => email === ctx.session.user.email)
      ) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes prestarte a ti mismo");
      }

      await checkDebtLimitAndIncr(ctx);

      const unsentEmails: string[] = [];
      for (const email of input.borrowerEmails) {
        const emailAlreadySent = await checkAndMarkEmailSent(email);

        if (!emailAlreadySent) {
          unsentEmails.push(email);
        }

        void addRecentEmail({
          email,
          inviterId: ctx.session.user.id,
        });
      }

      return ctx.prisma.$transaction(async (prisma) => {
        const createdDebt = await prisma.debt.create({
          data: {
            name: input.generalInfo.name,
            description: input.generalInfo.description,
            currency: input.generalInfo.currency,
            lender: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            amount: input.generalInfo.amount,
            dueDate: input.generalInfo.dueDate,
            recurringFrequency: input.generalInfo.recurrency?.frequency,
            duration: input.generalInfo.recurrency?.duration,
          },
          select: getUserDebtsSelect,
        });

        await prisma.pendingInvite.createMany({
          data: input.borrowerEmails.map((email) => ({
            inviteeEmail: email,
            debtId: createdDebt.id,
            inviterId: ctx.session.user.id,
          })),
        });

        if (unsentEmails.length > 0) {
          sendInvitationEmail({
            multiple: true,
            toEmails: unsentEmails,
            mail: ctx.mail,
            invitationEmailProps: {
              inviterEmail: ctx.session.user.email,
              inviterName: ctx.session.user.name,
              debtName: input.generalInfo.name,
            },
          });
        }

        return createdDebt;
      });
    }),
  archiveDebt: TRPCProcedures.protected
    .input(
      z.object({
        debtId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const debt = await ctx.prisma.debt.findFirst({
        where: {
          id: input.debtId,
          lenderId: ctx.session.user.id,
          archived: {
            equals: null,
          },
        },
        select: {
          id: true,
        },
      });

      if (!debt) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("Deuda no encontrada");
      }

      return ctx.prisma.$transaction(async (prisma) => {
        await prisma.pendingInvite.deleteMany({
          where: {
            debtId: debt.id,
          },
        });

        return prisma.debt.update({
          where: {
            id: debt.id,
          },
          data: {
            archived: DateTime.now().toUTC().toISO(),
          },
          select: {
            id: true,
          },
        });
      });
    }),
  getUniquePartners: TRPCProcedures.protected
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
    }),
});
