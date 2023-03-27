import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { deleteGroupInput } from "$/server/api/routers/groups/mutations/delete/input";
import handleMainError from "$/server/log/handleMainError";
import { TRPCError } from "@trpc/server";

const deleteGroupHandler = protectedVerifiedProcedure
  .input(deleteGroupInput)
  .mutation(async ({ ctx, input }) => {
    try {
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
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No eres el dueño del grupo",
        });
      }

      return ctx.prisma.group.delete({
        where: {
          id: input.groupId,
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      handleMainError(error);
    }
  });

export default deleteGroupHandler;
