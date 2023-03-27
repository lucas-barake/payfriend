import { type FC } from "react";
import { type InferQueryResult } from "@trpc/react-query/src/utils/inferReactQueryProcedure";
import { type AppRouter } from "$/server/api/root";
import { type GetSettingsInput } from "$/server/api/routers/groups/queries/getSettingsById/input";
import { api } from "$/utils/api";
import {
  type UpdateDeleteUserValueOptions,
  type UpdateUserRoleInput,
} from "$/server/api/routers/groups/mutations/updateUserRole/input";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";
import GroupMember from "$/pages/dashboard/[groupId]/(page-lib)/component/GroupMember";

type Props = {
  member: NonNullable<
    InferQueryResult<AppRouter["groups"]["getSettingsById"]>["data"]
  >["members"][number];
  queryVariables: GetSettingsInput;
};

const Member: FC<Props> = ({ member, queryVariables }) => {
  const utils = api.useContext();
  const updateRoleMutation = api.groups.updateUserRole.useMutation();
  const removeUserMutation = api.groups.removeUser.useMutation();

  async function handleRoleChange(
    newRole: UpdateDeleteUserValueOptions,
    userId: UpdateUserRoleInput["userId"]
  ): Promise<void> {
    const prevData = utils.groups.getSettingsById.getData(queryVariables);

    if (newRole === "REMOVE") {
      const res = await toast.promise(
        removeUserMutation.mutateAsync({
          groupId: queryVariables.groupId,
          userId,
          isPending: member.isPending,
        }),
        {
          loading: "Eliminando usuario",
          success: "Usuario eliminado",
          error: handleToastError,
        }
      );
      if (prevData == null || res === undefined) return;

      utils.groups.getSettingsById.setData(queryVariables, {
        ...prevData,
        members: prevData.members.filter((member) => member.id !== res.userId),
      });
    } else {
      const res = await toast.promise(
        updateRoleMutation.mutateAsync({
          role: newRole,
          groupId: queryVariables.groupId,
          userId,
        }),
        {
          loading: "Actualizando rol",
          success: "Rol actualizado",
          error: handleToastError,
        }
      );
      if (res?.role == null || prevData == null) return;

      utils.groups.getSettingsById.setData(queryVariables, {
        ...prevData,
        members: prevData.members.map((member) =>
          member.id === res.userId
            ? {
                ...member,
                role: res.role,
              }
            : member
        ),
      });
    }

    await utils.user.getOwnedGroups.invalidate();
    await utils.user.getSharedGroups.invalidate();
    await utils.groups.getById.invalidate();
  }

  return (
    <GroupMember
      key={member.id}
      user={member}
      role={member.role}
      pending={member.isPending}
      onChange={(v) => {
        if (v === undefined || member.email == null) return;
        void handleRoleChange(v, member.id);
      }}
      updating={updateRoleMutation.isLoading}
    />
  );
};

export default Member;
