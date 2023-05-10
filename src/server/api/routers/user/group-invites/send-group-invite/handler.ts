import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { sendInviteInput } from "$/server/api/routers/user/group-invites/send-group-invite/input";
import { MAX_NUM_OF_GROUP_USERS } from "$/server/api/routers/user/restrictions";
import { type Prisma } from "@prisma/client";
import CUSTOM_EXCEPTIONS from "$/server/api/custom-exceptions";

export const inviteUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} satisfies Prisma.UserSelect;

const sendGroupInvite = protectedVerifiedProcedure
  .input(sendInviteInput)
  .mutation(async ({ ctx, input }) => {
    const hasPermission = await ctx.prisma.group.findFirst({
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

    if (!hasPermission) {
      throw CUSTOM_EXCEPTIONS.UNAUTHORIZED();
    }

    const numOfUsers = await ctx.prisma.group.count({
      where: {
        id: input.groupId,
      },
    });

    if (numOfUsers >= MAX_NUM_OF_GROUP_USERS) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST(
        "El grupo ya tiene el máximo de usuarios"
      );
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario no existe");
    }

    if (user.id === ctx.session.user.id) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("No puedes invitarte a ti mismo");
    }

    try {
      return await ctx.prisma.pendingInvite.create({
        data: {
          userId: user.id,
          groupId: input.groupId,
          role: input.role,
        },
        select: {
          role: true,
          user: {
            select: inviteUserSelect,
          },
        },
      });
    } catch (error) {
      throw CUSTOM_EXCEPTIONS.BAD_REQUEST("El usuario ya está invitado");
    }
  });

export default sendGroupInvite;
