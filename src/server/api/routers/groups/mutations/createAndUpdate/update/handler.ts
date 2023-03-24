import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { updateGroupInput } from "$/server/api/routers/groups/mutations/createAndUpdate/input";
import { TRPCError } from "@trpc/server";

const updateHandler = protectedVerifiedProcedure
  .input(updateGroupInput)
  .mutation(async ({ ctx, input }) => {
    const exists = await ctx.prisma.debtTable.findFirst({
      where: {
        id: input.id,
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

    if (!exists) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No se encontró el grupo o no tienes permisos para editarlo",
      });
    }

    const created = await ctx.prisma.debtTable.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        description: input.description,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return created;
  });

export default updateHandler;
