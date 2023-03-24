import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { deleteGroupInput } from "$/server/api/routers/groups/mutations/delete/input";
import handleMainError from "$/server/log/handleMainError";
import { TRPCError } from "@trpc/server";

const deleteGroupHandler = protectedVerifiedProcedure
  .input(deleteGroupInput)
  .mutation(async ({ ctx, input }) => {
    try {
      const isOwner = await ctx.prisma.debtTable.findFirst({
        where: {
          id: input.groupId,
          collaborators: {
            some: {
              collaborator: {
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

      const deleted = await ctx.prisma.debtTable.delete({
        where: {
          id: input.groupId,
        },
        select: {
          id: true,
        },
      });

      return deleted;
    } catch (error) {
      handleMainError(error);
    }
  });

export default deleteGroupHandler;
