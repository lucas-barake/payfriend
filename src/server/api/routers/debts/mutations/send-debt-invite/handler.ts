import { TRPCProcedures } from "$/server/api/trpc";
import { sendDebtInviteInput } from "$/server/api/routers/debts/mutations/send-debt-invite/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { MAX_NUM_OF_GROUP_USERS } from "$/server/api/routers/user/restrictions";
import { env } from "$/env.mjs";
import { APP_NAME } from "$/lib/constants/app-name";
import { type MailDataRequired } from "@sendgrid/mail";
import { logger } from "$/server/logger";
import { Prisma } from "@prisma/client";

export const sendDebtInvite = TRPCProcedures.verifiedLimited
  .input(sendDebtInviteInput)
  .mutation(async ({ ctx, input }) => {
    const lender = await ctx.prisma.debt.findFirst({
      where: {
        id: input.debtId,
        lenderId: ctx.session.user.id,
        archived: false,
      },
      select: {
        borrowers: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        pendingInvites: {
          select: {
            debtId: true,
          },
        },
      },
    });

    if (!lender) {
      throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();
    }

    if (ctx.session.user.email === input.email) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes invitarte a ti mismo");
    }

    if (
      lender.borrowers.some((borrower) => borrower.user.email === input.email)
    ) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario ya está en el grupo");
    }

    const totalCount = lender.borrowers.length + lender.pendingInvites.length;

    if (totalCount >= MAX_NUM_OF_GROUP_USERS) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "El grupo ya tiene el máximo de usuarios"
      );
    }

    try {
      const msg = {
        to: input.email,
        from: env.SENDGRID_FROM_EMAIL,
        subject: `Te invitaron a una deuda en ${APP_NAME}`,
        text: `Entra a ${
          env.NODE_ENV === "production"
            ? "https://www.payfriend.com/dashboard"
            : "http://localhost:3000/dashboard"
        } para aceptar la invitación`,
        html: `<strong>Entra a <a href="${
          env.NODE_ENV === "production"
            ? "https://www.payfriend.com/dashboard"
            : "http://localhost:3000/dashboard"
        }">Payfriend</a> para aceptar la invitación</strong>`,
        mailSettings: {
          sandboxMode: {
            enable: env.SENDGRID_SANDBOX_MODE,
          },
        },
      } satisfies MailDataRequired;

      if (env.SENDGRID_SANDBOX_MODE) {
        logger.info(`Email sent to ${input.email}`);
      }

      void ctx.mail.send(msg);
    } catch (err) {
      logger.error(err);
    }

    try {
      return await ctx.prisma.pendingInvite.create({
        data: {
          debt: {
            connect: {
              id: input.debtId,
            },
          },
          inviteeEmail: input.email,
          inviter: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        select: {
          inviteeEmail: true,
          debt: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario ya está invitado");
        }
      }
      throw error;
    }
  });
