import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import { createDebtInput } from "$/server/api/routers/debts/mutations/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { getUserDebtsSelect } from "$/server/api/routers/debts/queries/handler";
import { rawQueries } from "$/server/api/routers/(routers-lib)/raw-queries";
import { z } from "zod";
import { BorrowerStatus } from "@prisma/client";

/*// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  // NOTE: When using postgresql, mysql or sqlserver, uncomment the @db.Text annotations in model Account below
  // Further reading:
  // https://next-auth.js.org/adapters/prisma#create-the-prisma-schema
  // https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#string
  url      = env("DATABASE_URL")
}

model Debt {
  id             String          @id @default(cuid())
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  name           String
  description    String?         @db.Text
  amount         Float
  dueDate        DateTime?
  lenderId       String
  lender         User            @relation(fields: [lenderId], references: [id])
  archived       Boolean         @default(false)
  borrowers      Borrower[]
  pendingInvites PendingInvite[]
}

enum BorrowerStatus {
  YET_TO_PAY
  PENDING_CONFIRMATION
  CONFIRMED
}

model Borrower {
  id        String          @id @default(cuid())
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
  userId    String
  user      User            @relation(fields: [userId], references: [id])
  debtId    String
  debt      Debt            @relation(fields: [debtId], references: [id])
  status    BorrowerStatus? @default(YET_TO_PAY)

  @@unique([userId, debtId])
}

model PendingInvite {
  createdAt    DateTime @default(now())
  inviteeEmail String
  inviterId    String
  inviter      User     @relation(fields: [inviterId], references: [id])
  debtId       String
  debt         Debt     @relation(fields: [debtId], references: [id])

  @@id([inviteeEmail, debtId])
}

// Necessary for Next auth
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id              String          @id @default(cuid())
  name            String?
  email           String?         @unique
  emailVerified   DateTime?
  phoneNumber     String?         @unique
  phoneVerified   DateTime?       @db.Timestamptz(6)
  image           String?
  accounts        Account[]
  sessions        Session[]
  debtsAsLender   Debt[]
  debtsAsBorrower Borrower[]
  pendingInvites  PendingInvite[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
*/

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
  update: protectedVerifiedProcedure
    .input(
      z.object({
        debtId: z.string().cuid(),
        description: createDebtInput.shape.description,
        amount: createDebtInput.shape.amount,
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

      return ctx.prisma.debt.update({
        where: {
          id: debt.id,
        },
        data: {
          description: input.description,
          amount: input.amount,
        },
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
});
