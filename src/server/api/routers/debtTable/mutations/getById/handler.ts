import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getDebtTableByIdInput } from "$/server/api/routers/debtTable/mutations/getById/input";

const getByIdHandler = protectedVerifiedProcedure
  .input(getDebtTableByIdInput)
  .query(async ({ ctx, input }) => {
    const query = await ctx.prisma.debtTable.findFirst({
      where: {
        id: input,
        collaborators: {
          some: {
            collaboratorId: ctx.session.user.id,
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

    if (!query) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No se encontró la tabla",
      });
    }

    return query;
  });

export default getByIdHandler;
