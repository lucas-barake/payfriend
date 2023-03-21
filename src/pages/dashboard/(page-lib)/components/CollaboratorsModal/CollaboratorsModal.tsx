import { type FC } from "react";
import Modal from "$/components/Modal/Modal";
import Form from "$/components/Form";
import Button from "$/components/Button";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { type DebtTable } from ".prisma/client";
import { Controller, useForm } from "react-hook-form";
import {
  sendInviteInput,
  type SendInviteInput,
  sendInviteRoleOptions,
} from "$/server/api/routers/invites/mutations/sendInvite/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { z } from "zod";

type Props = {
  show: boolean;
  onClose: () => void;
  debtTableId: DebtTable["id"];
};

const CollaboratorsModal: FC<Props> = ({ show, onClose, debtTableId }) => {
  const session = useSession();

  const sendInviteMutation = api.invites.sendInvite.useMutation();
  const collaboratorsQuery = api.debtTables.getAllCollaborators.useQuery(
    debtTableId,
    {
      enabled: show && session.status === "authenticated",
    }
  );
  const allCollaborators = collaboratorsQuery.data?.collaborators ?? [];
  const allPendingCollaborators = collaboratorsQuery.data?.pendingInvites ?? [];
  const allCollaboratorsAndPendingCollaborators = [
    ...allCollaborators.map(({ collaborator, role }) => ({
      user: collaborator,
      role,
      pending: false,
    })),
    ...allPendingCollaborators.map(({ user, role }) => ({
      user,
      role,
      pending: true,
    })),
  ];

  const form = useForm<SendInviteInput>({
    defaultValues: {
      debtTableId: debtTableId,
      role: "COLLABORATOR",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(
      sendInviteInput.superRefine((val, ctx) => {
        if (val.email === session.data?.user.email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "No puedes invitarte a ti mismo",
            path: ["email"],
          });
        }
      })
    ),
  });

  function afterClose(): void {
    form.reset();
  }

  async function handleSubmit(data: SendInviteInput): Promise<void> {
    await toast.promise(sendInviteMutation.mutateAsync(data), {
      loading: "Enviando invitación",
      success: "Invitación enviada",
      error: handleToastError,
    });

    if (sendInviteMutation.isSuccess) {
      onClose();
    }
  }

  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Comparte este grupo"
      afterClose={afterClose}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
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
          {collaboratorsQuery.isInitialLoading ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-4 w-20 animate-pulse rounded-full rounded-full bg-neutral-200 dark:bg-neutral-700" />
              </div>

              <div className="h-4 w-10 animate-pulse rounded-full rounded-full bg-neutral-200 dark:bg-neutral-700" />
            </div>
          ) : (
            <>
              {allCollaboratorsAndPendingCollaborators.map(({ user, role }) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
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
                      {user.name ?? "Sin nombre"}
                    </span>
                  </div>

                  {role === "OWNER" ? (
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">
                      Dueño
                    </span>
                  ) : (
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">
                      Colaborador
                    </span>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            color="neutral"
            outline
            onClick={onClose}
            className="flex w-1/2 justify-center"
          >
            Cerrar
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CollaboratorsModal;
