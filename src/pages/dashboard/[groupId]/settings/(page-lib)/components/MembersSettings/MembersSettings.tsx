import { type FC } from "react";
import Form from "$/components/Form";
import Button from "$/components/Button";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { type DebtTable, DebtTableRole } from ".prisma/client";
import { Controller, useForm } from "react-hook-form";
import {
  sendInviteInput,
  type SendInviteInput,
  sendInviteRoleOptions,
} from "$/server/api/routers/groupInvites/mutations/sendInvite/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { z } from "zod";
import { type InferQueryResult } from "@trpc/react-query/src/utils/inferReactQueryProcedure";
import { type AppRouter } from "$/server/api/root";
import { type GetSettingsInput } from "$/server/api/routers/groups/queries/getSettingsHandler/input";

type Props = {
  members: NonNullable<
    InferQueryResult<AppRouter["groups"]["getSettings"]>["data"]
  >["collaborators"];
  pendingMembers: NonNullable<
    InferQueryResult<AppRouter["groups"]["getSettings"]>["data"]
  >["pendingInvites"];
  queryVariables: GetSettingsInput;
};

const MembersSettings: FC<Props> = ({
  members,
  pendingMembers,
  queryVariables,
}) => {
  const session = useSession();

  const utils = api.useContext();
  const sendInviteMutation = api.groupInvites.sendInvite.useMutation({
    onSuccess: (createdPendingInvite) => {
      const prevSettings = utils.groups.getSettings.getData(queryVariables);
      if (prevSettings == null) return;

      utils.groups.getSettings.setData(queryVariables, {
        ...prevSettings,
        pendingInvites: [...prevSettings.pendingInvites, createdPendingInvite],
      });

      return {
        prevSettings,
      };
    },
  });

  const allCollaboratorsAndPendingCollaborators = [
    ...members.map(({ collaborator, role }) => ({
      user: collaborator,
      role,
      pending: false,
    })),
    ...pendingMembers.map(({ user, role }) => ({
      user,
      role,
      pending: true,
    })),
  ];

  const form = useForm<SendInviteInput>({
    defaultValues: {
      debtTableId: queryVariables.groupId,
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

        if (
          allCollaboratorsAndPendingCollaborators.some(
            (collaborator) => collaborator.user.email === val.email
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ya hay un usuario con ese correo",
            path: ["email"],
          });
        }
      })
    ),
  });

  async function handleSubmit(data: SendInviteInput): Promise<void> {
    await toast.promise(sendInviteMutation.mutateAsync(data), {
      loading: "Enviando invitación",
      success: "Invitación enviada",
      error: handleToastError,
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
              <Form.Listbox
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
        {allCollaboratorsAndPendingCollaborators.map(
          ({ user, role, pending }) => (
            <div key={user.email} className="flex items-center justify-between">
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
                  {user.name} {pending && "(pendiente)"}
                </span>
              </div>

              {role === "OWNER" ? (
                <span className="font-medium text-neutral-900 dark:text-neutral-200">
                  Dueño
                </span>
              ) : (
                <Form.Listbox
                  value={role}
                  onChange={(v) => {
                    console.log(v);
                  }}
                  options={sendInviteRoleOptions}
                  displayValue={
                    sendInviteRoleOptions.find(
                      (option) => option.value === role
                    )?.label
                  }
                />
              )}
            </div>
          )
        )}
      </div>
    </Form>
  );
};

export default MembersSettings;
