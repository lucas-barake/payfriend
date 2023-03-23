import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const changeRoleHandler = protectedVerifiedProcedure
  .input(
    z.object({
      debtTableId: z.string().cuid(),
      userId: z.string().cuid(),
      role: z.enum(["VIEWER", "COLLABORATOR"]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const debtTable = await ctx.prisma.debtTable.findFirst({
        where: {
          id: input.debtTableId,
          collaborators: {
            some: {
              collaboratorId: ctx.session.user.id,
              role: "OWNER",
            },
          },
        },
        select: {
          collaborators: {
            select: {
              collaboratorId: true,
            },
          },
        },
      });

      if (!debtTable) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No se encontró el grupo",
        });
      }

      const collaborator = debtTable.collaborators.find(
        (collaborator) => collaborator.collaboratorId === input.userId
      );

      if (!collaborator) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No se encontró el colaborador",
        });
      }

      await ctx.prisma.debtTablesCollaboratorsMapping.update({
        where: {
          collaboratorId_debtTableId: {
            collaboratorId: input.userId,
            debtTableId: input.debtTableId,
          },
        },
        data: {
          role: input.role,
        },
        select: {
          role: true,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Ocurrió un error al cambiar el rol del colaborador",
      });
    }
  });

export default changeRoleHandler;
