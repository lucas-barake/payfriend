import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { updateGroupInput } from "$/server/api/routers/groups/groups/create-update/input";
import { TRPCError } from "@trpc/server";

const updateGroup = protectedVerifiedProcedure
  .input(updateGroupInput)
  .mutation(async ({ ctx, input }) => {
    const exists = await ctx.prisma.group.findFirst({
      where: {
        id: input.id,
        users: {
          some: {
            userId: ctx.session.user.id,
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

    return ctx.prisma.group.update({
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
  });

export default updateGroup;
