import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createGroupInput } from "$/server/api/routers/groups/groups/create-update/input";
import { getUserGroupsSelect } from "$/server/api/routers/user/groups/getOwnedOrSharedGroups/handler";

const createGroup = protectedVerifiedProcedure
  .input(createGroupInput)
  .mutation(async ({ ctx, input }) => {
    const debtTableCount = await ctx.prisma.group.count({
      where: {
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

    if (debtTableCount >= 2) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No puedes tener más de 2 tablas",
      });
    }

    return ctx.prisma.group.create({
      data: {
        name: input.name,
        description: input.description,
        users: {
          create: {
            userId: ctx.session.user.id,
            role: "OWNER",
          },
        },
      },
      select: getUserGroupsSelect,
    });
  });

export default createGroup;
