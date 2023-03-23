import { protectedVerifiedProcedure } from "$/server/api/trpc";

const getAllHandler = protectedVerifiedProcedure.query(async ({ ctx }) => {
  const query = await ctx.prisma.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
    select: {
      pendingInvites: {
        select: {
          debtTable: {
            select: {
              id: true,
              name: true,
              collaborators: {
                where: {
                  role: "OWNER",
                },
                include: {
                  collaborator: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const pendingInvites = query?.pendingInvites ?? [];
  return pendingInvites.map((pendingInvite) => ({
    debtTableId: pendingInvite.debtTable.id,
    name: pendingInvite.debtTable.name,
    owner: pendingInvite.debtTable.collaborators[0]?.collaborator.name,
  }));
});

export default getAllHandler;
