import { TRPCProcedures } from "$/server/api/trpc";
import { createDebtInput } from "$/server/api/routers/debts/mutations/handlers/create/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { env } from "$/env.mjs";
import { APP_NAME } from "$/lib/constants/app-name";
import { type MailDataRequired } from "@sendgrid/mail";
import { logger } from "$/server/logger";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries";
import { checkDebtLimitAndIncr } from "$/server/api/routers/debts/mutations/lib/utils/check-debt-limit-and-incr";

export const create = TRPCProcedures.verifiedLimited
  .input(createDebtInput)
  .mutation(async ({ ctx, input }) => {
    if (
      input.borrowerEmails.some((email) => email === ctx.session.user.email)
    ) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes prestarte a ti mismo");
    }

    await checkDebtLimitAndIncr(ctx);

    for (const email of input.borrowerEmails) {
      try {
        const msg = {
          to: email,
          from: env.SENDGRID_FROM_EMAIL,
          subject: `Te invitaron a una deuda en ${APP_NAME}`,
          text: `Entra a ${
            env.VERCEL_URL !== undefined
              ? `https://${env.VERCEL_URL}/dashboard`
              : "http://localhost:3000/dashboard"
          } para aceptar la invitación`,
          html: `<strong>Entra a <a href="${
            env.VERCEL_URL !== undefined
              ? `https://${env.VERCEL_URL}/dashboard`
              : "http://localhost:3000/dashboard"
          }">${APP_NAME}</a> para aceptar la invitación</strong>`,
          mailSettings: {
            sandboxMode: {
              enable: env.SENDGRID_SANDBOX_MODE,
            },
          },
        } satisfies MailDataRequired;

        if (env.SENDGRID_SANDBOX_MODE) {
          logger.info(`Email sent to ${email}`);
        }

        void ctx.mail.send(msg);
      } catch (err) {
        logger.error(err);
      }
    }

    return ctx.prisma.$transaction(async (prisma) => {
      const createdDebt = await prisma.debt.create({
        data: {
          name: input.name,
          description: input.description,
          lender: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          amount: input.amount,
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

      return createdDebt;
    });
  });
