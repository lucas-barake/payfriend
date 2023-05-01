import { type FC } from "react";
import { type GroupRole, type User } from "@prisma/client";
import Image from "next/image";
import { Form } from "src/components/ui/form";
import { type Neverify } from "$/types/utility";
import {
  updateDeleteUserOptions,
  type UpdateDeleteUserValueOptions,
  type UpdateUserRoleInput,
} from "$/server/api/routers/groups/users/update-user-role/input";

type UpdateProps = {
  onChange: (v: UpdateDeleteUserValueOptions) => void;
  updating: boolean;
};

type Props = {
  user: Pick<User, "name" | "email" | "image">;
  role: GroupRole;
  pending: boolean;
} & (UpdateProps | Neverify<UpdateProps>);

const GroupMember: FC<Props> & {
  Skeleton: FC;
} = ({ user, role, pending, onChange, updating }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {user.image !== null ? (
          <Image
            src={user.image}
            alt={user.name ?? "Imagen de perfil"}
            width={40}
            height={40}
            className="pointer-events-none select-none rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-neutral-200" />
        )}

        <span className="font-medium text-neutral-900 dark:text-neutral-200">
          {user.name?.split(" ").slice(0, 2).join(" ")}{" "}
          {pending && "(pendiente)"}
        </span>
      </div>

      {role === "OWNER" ? (
        <span className="font-medium text-neutral-900 dark:text-neutral-200">
          Dueño
        </span>
      ) : onChange !== undefined ? (
        <Form.ListBox
          value={role}
          onChange={(v) => {
            if (updating) return;
            onChange(v as UpdateUserRoleInput["role"]);
          }}
          disabled={updating}
          options={updateDeleteUserOptions}
          displayValue={
            updateDeleteUserOptions.find((o) => o.value === role)?.label ?? ""
          }
        />
      ) : (
        <span className="font-medium text-neutral-900 dark:text-neutral-200">
          {role}
        </span>
      )}
    </div>
  );
};

const Skeleton: FC = () => {
  return (
    <div className="flex animate-pulse items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />

        <div className="h-4 w-20 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      </div>

      <div className="h-4 w-20 rounded-full bg-neutral-300 dark:bg-neutral-700" />
    </div>
  );
};

GroupMember.Skeleton = Skeleton;
export default GroupMember;
