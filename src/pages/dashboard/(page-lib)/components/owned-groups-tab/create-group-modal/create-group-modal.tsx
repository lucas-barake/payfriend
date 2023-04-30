import { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGroupInput,
  type CreateGroupInput,
} from "$/server/api/routers/groups/groups/create-update/input";
import { Form } from "src/components/ui/form";
import { Button } from "$/components/ui/button";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { useRouter } from "next/router";
import { Dialog } from "$/components/ui/dialog";

const CreateGroupModal: FC = () => {
  const router = useRouter();
  const utils = api.useContext();
  const create = api.groups.createGroup.useMutation({
    onSuccess: (newTable) => {
      const prevData = utils.user.getOwnedGroups.getData();

      utils.user.getOwnedGroups.setData(
        undefined,
        prevData !== undefined ? [newTable, ...prevData] : [newTable]
      );

      void router.push(`/dashboard/${newTable.id}`);

      return {
        prevData,
      };
    },
  });

  const form = useForm<CreateGroupInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(createGroupInput),
  });

  async function handleSubmit(data: CreateGroupInput): Promise<void> {
    await toast.promise(create.mutateAsync(data), {
      loading: "Creando grupo...",
      success: "Grupo creado",
      error: handleToastError,
    });
  }

  return (
    <Dialog.Content>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <Form.Input
          label="Nombre"
          {...form.register("name")}
          required
          error={form.formState.errors.name?.message}
        />
        <Form.TextArea
          label="Descripción"
          {...form.register("description")}
          error={form.formState.errors.description?.message}
        />

        {form.formState.errors.root?.message !== undefined && (
          <span className="text-sm text-red-500">
            {form.formState.errors.root?.message}
          </span>
        )}

        <Dialog.Footer className="mt-4">
          <Button
            type="submit"
            loading={create.isLoading}
            className="flex flex-1 items-center justify-center py-2"
          >
            Crear Grupo
          </Button>

          <Dialog.Trigger asChild>
            <Button
              variant="secondary"
              className="flex flex-1 items-center justify-center py-2"
            >
              Cancelar
            </Button>
          </Dialog.Trigger>
        </Dialog.Footer>
      </Form>
    </Dialog.Content>
  );
};

export default CreateGroupModal;
