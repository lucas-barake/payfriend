import {
  createTRPCRouter,
  protectedVerifiedProcedure,
} from "$/server/api/trpc";
import {
  createGroupInput,
  deleteGroupInput,
  updateGroupInput,
} from "$/server/api/routers/groups/groups/mutations/input";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";
import { TRPCError } from "@trpc/server";
import { getUserGroupsSelect } from "$/server/api/routers/user/groups/queries";

export const groupMutations = createTRPCRouter({
  createGroup: protectedVerifiedProcedure
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
        throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes tener más de 2 tablas");
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
    }),
  updateGroup: protectedVerifiedProcedure
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
    }),
  deleteGroup: protectedVerifiedProcedure
    .input(deleteGroupInput)
    .mutation(async ({ ctx, input }) => {
      const isOwner = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
          users: {
            some: {
              user: {
                id: ctx.session.user.id,
              },
              role: "OWNER",
            },
          },
        },
      });

      if (!isOwner) {
        throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();
      }

      return ctx.prisma.group.delete({
        where: {
          id: input.groupId,
        },
        select: {
          id: true,
        },
      });
    }),
});
