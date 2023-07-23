import { createTRPCRouter, TRPCProcedures } from "$/server/api/trpc";
import {
  createDebtInput,
  sendDebtInviteInput,
} from "$/server/api/routers/debts/mutations/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries/handler";
import { rawQueries } from "$/server/api/routers/(routers-lib)/raw-queries";
import { z } from "zod";
import { BorrowerStatus, Prisma } from "@prisma/client";
import { MAX_NUM_OF_GROUP_USERS } from "$/server/api/routers/user/restrictions";
import { type MailDataRequired } from "@sendgrid/mail";
import { env } from "$/env.mjs";
import { APP_NAME } from "$/lib/constants/app-name";
import { logger } from "$/server/logger";

export const debtsMutations = createTRPCRouter({
  create: TRPCProcedures.verifiedLimited
    .input(createDebtInput)
    .mutation(async ({ ctx, input }) => {
      if (
        input.borrowerEmails.some((email) => email === ctx.session.user.email)
      ) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes prestarte a ti mismo");
      }

      const debtsCount = await rawQueries.getUserDebtCount(
        ctx.prisma,
        ctx.session.user.id
      );
      const totalDebtsCount =
        debtsCount.lenderDebtsCount + debtsCount.borrowerDebtsCount;

      if (totalDebtsCount >= 5) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
          "Has alcanzado el límite de deudas"
        );
      }

      for (const email of input.borrowerEmails) {
        try {
          const msg = {
            to: email,
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
    }),
  archiveDebt: TRPCProcedures.verified
    .input(
      z.object({
        debtId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const debt = await ctx.prisma.debt.findFirst({
        where: {
          id: input.debtId,
          lenderId: ctx.session.user.id,
          archived: false,
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
            archived: true,
          },
        });
      });
    }),
  setPendingConfirmation: TRPCProcedures.verified
    .input(
      z.object({
        debtId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const debt = await ctx.prisma.debt.findFirst({
        where: {
          id: input.debtId,
          archived: false,
          borrowers: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      });

      if (!debt) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("Deuda no encontrada");
      }

      return ctx.prisma.borrower.update({
        where: {
          userId_debtId: {
            debtId: debt.id,
            userId: ctx.session.user.id,
          },
        },
        data: {
          status: "PENDING_CONFIRMATION",
        },
      });
    }),
  confirmPendingConfirmation: TRPCProcedures.verified
    .input(
      z.object({
        debtId: z.string().cuid(),
        userId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const debt = await ctx.prisma.debt.findFirst({
        where: {
          id: input.debtId,
          lenderId: ctx.session.user.id,
          archived: false,
        },
        select: {
          id: true,
          borrowers: {
            select: {
              id: true,
              status: true,
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!debt) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("Deuda no encontrada");
      }

      const borrower = debt.borrowers.find(
        (borrower) => borrower.user.id === input.userId
      );

      if (!borrower) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("Usuario no encontrado");
      }

      if (borrower.status !== "PENDING_CONFIRMATION") {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
          "El usuario no está pendiente de confirmación"
        );
      }

      return ctx.prisma.borrower.update({
        where: {
          id: borrower.id,
        },
        data: {
          status: BorrowerStatus.CONFIRMED,
        },
      });
    }),
  rejectPendingConfirmation: TRPCProcedures.verified
    .input(
      z.object({
        debtId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const debt = await ctx.prisma.debt.findFirst({
        where: {
          id: input.debtId,
          lenderId: ctx.session.user.id,
          archived: false,
        },
        select: {
          id: true,
          borrowers: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (!debt) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("Deuda no encontrada");
      }

      const borrower = debt.borrowers.find(
        (borrower) => borrower.status === "PENDING_CONFIRMATION"
      );

      if (!borrower) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("No hay deudores pendientes");
      }

      return ctx.prisma.borrower.update({
        where: {
          id: borrower.id,
        },
        data: {
          status: "YET_TO_PAY",
        },
      });
    }),
  sendDebtInvite: TRPCProcedures.verifiedLimited
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
    }),
  removeDebtInvite: TRPCProcedures.verified
    .input(
      z.object({
        debtId: z.string().cuid(),
        inviteeEmail: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const pendingInvite = await ctx.prisma.pendingInvite.findFirst({
        where: {
          debtId: input.debtId,
          inviterId: ctx.session.user.id,
        },
        select: {
          inviteeEmail: true,
        },
      });

      if (!pendingInvite) {
        throw CUSTOM_EXCEPTIONS.NOT_FOUND("Invitación no encontrada");
      }

      if (pendingInvite.inviteeEmail !== input.inviteeEmail) {
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El email no coincide");
      }

      return ctx.prisma.pendingInvite.delete({
        where: {
          inviteeEmail_debtId: {
            debtId: input.debtId,
            inviteeEmail: input.inviteeEmail,
          },
        },
      });
    }),
});
