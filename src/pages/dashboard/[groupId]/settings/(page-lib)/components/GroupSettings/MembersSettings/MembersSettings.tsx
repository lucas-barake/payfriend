import { type FC } from "react";
import Form from "$/components/Form";
import Button from "$/components/Button";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { Controller, useForm } from "react-hook-form";
import {
  sendInviteInput,
  type SendInviteInput,
  sendInviteRoleOptions,
} from "$/server/api/routers/user/groupInvites/sendGroupInvite/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { type InferQueryResult } from "@trpc/react-query/src/utils/inferReactQueryProcedure";
import { type AppRouter } from "$/server/api/root";
import { type GetSettingsInput } from "$/server/api/routers/groups/groups/getSettingsById/input";
import { MAX_NUM_OF_GROUP_USERS } from "$/server/api/routers/user/restrictions";
import Member from "$/pages/dashboard/[groupId]/settings/(page-lib)/components/GroupSettings/MembersSettings/Member";

type Props = {
  members: NonNullable<
    InferQueryResult<AppRouter["groups"]["getSettingsById"]>["data"]
  >["members"];
  queryVariables: GetSettingsInput;
};

const MembersSettings: FC<Props> = ({ members, queryVariables }) => {
  const session = useSession();

  const utils = api.useContext();
  const sendInviteMutation = api.user.sendGroupInvite.useMutation();

  const form = useForm<SendInviteInput>({
    defaultValues: {
      groupId: queryVariables.groupId,
      role: "COLLABORATOR",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(
      sendInviteInput.superRefine((val, ctx) => {
        if (val.email === session.data?.user.email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "No puedes autoinvitarte",
            path: ["email"],
          });
        }

        if (members.some((member) => member.email === val.email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ya hay un usuario con ese correo",
            path: ["email"],
          });
        }

        if (members.length >= MAX_NUM_OF_GROUP_USERS) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `No puedes agregar más de ${MAX_NUM_OF_GROUP_USERS} miembros`,
            path: ["email"],
          });
        }
      })
    ),
  });

  async function handleSubmit(data: SendInviteInput): Promise<void> {
    const res = await toast.promise(sendInviteMutation.mutateAsync(data), {
      loading: "Enviando invitación",
      success: "Invitación enviada",
      error: handleToastError,
    });
    if (res == null) return;

    const prevSettings = utils.groups.getSettingsById.getData(queryVariables);
    if (prevSettings == null) return;

    void utils.user.getOwnedGroups.invalidate();

    utils.groups.getSettingsById.setData(queryVariables, {
      ...prevSettings,
      members: [
        ...prevSettings.members,
        {
          id: res.user.id,
          role: data.role,
          email: res.user.email,
          name: res.user.name,
          image: res.user.image,
          isPending: true,
        },
      ],
    });

    form.reset();
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <h1 className="text-2xl font-bold">Miembros</h1>

      <div className="flex items-end gap-2">
        <Form.Input
          label="Correo electrónico"
          {...form.register("email")}
          placeholder="colaborador@gmail.com"
        />

        <div className="flex items-center gap-2">
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <Form.ListBox
                value={field.value}
                onChange={field.onChange}
                options={sendInviteRoleOptions}
                displayValue={
                  sendInviteRoleOptions.find(
                    (option) => option.value === field.value
                  )?.label
                }
              />
            )}
          />

          <Button
            color="green"
            type="submit"
            className="flex items-center gap-2"
          >
            <PlusCircleIcon className="h-6 w-6 text-neutral-100" />
            <span className="sr-only">Agregar</span>
          </Button>
        </div>
      </div>

      {form.formState.errors.email?.message !== undefined && (
        <span className="ml-1 text-sm font-medium text-red-500">
          {form.formState.errors.email.message}
        </span>
      )}

      <div className="my-3 flex flex-col gap-3">
        {members.map((member) => (
          <Member
            key={member.id}
            member={member}
            queryVariables={queryVariables}
          />
        ))}
      </div>
    </Form>
  );
};

export default MembersSettings;
