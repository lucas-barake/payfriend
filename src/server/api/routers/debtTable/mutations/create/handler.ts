import { protectedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createDebTableInput } from "$/server/api/routers/debtTable/mutations/create/input";

const createHandler = protectedProcedure
  .input(createDebTableInput)
  .mutation(async ({ ctx, input }) => {
    const debtTableCount = await ctx.prisma.debtTable.count({
      where: {
        collaborators: {
          some: {
            collaboratorId: ctx.session.user.id,
            role: {
              equals: "OWNER",
            },
          },
        },
      },
    });

    if (debtTableCount >= 2) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No puedes tener más de 2 tablas",
      });
    }

    const query = await ctx.prisma.debtTable.create({
      data: {
        name: input.name,
        description: input.description,
        collaborators: {
          create: {
            collaboratorId: ctx.session.user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        collaborators: {
          select: {
            collaboratorId: true,
          },
        },
      },
    });

    return query;
  });

export default createHandler;
