import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
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

export const debtsMutations = createTRPCRouter({
  create: protectedVerifiedProcedure
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
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes tener más de 5 deudas");
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
  archiveDebt: protectedVerifiedProcedure
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
  setPendingConfirmation: protectedVerifiedProcedure
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
  confirmPendingConfirmation: protectedVerifiedProcedure
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
  rejectPendingConfirmation: protectedVerifiedProcedure
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
  sendDebtInvite: protectedVerifiedProcedure
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
  removeDebtInvite: protectedVerifiedProcedure
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
