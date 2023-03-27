import { type FC } from "react";

import { useForm } from "react-hook-form";
import Form from "$/components/Form";
import Button from "$/components/Button";
import { SaveIcon } from "@heroicons/react/outline";
import {
  updateGroupInput,
  type UpdateGroupInput,
} from "$/server/api/routers/groups/groups/create-update/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";
import { type GetSettingsInput } from "$/server/api/routers/groups/groups/getSettingsById/input";
import { type Group } from "@prisma/client";

type Props = {
  groupName: Group["name"];
  groupDescription: Group["description"];
  queryVariables: GetSettingsInput;
};

const GeneralSettings: FC<Props> = ({
  groupName,
  groupDescription,
  queryVariables,
}) => {
  const utils = api.useContext();
  const updateMutation = api.groups.updateGroup.useMutation({
    onSuccess: async (updatedGroup) => {
      const prevData = utils.groups.getSettingsById.getData(queryVariables);
      if (prevData == null) return;

      await utils.user.getOwnedGroups.invalidate();
      await utils.groups.getGroupById.invalidate({
        id: queryVariables.groupId,
      });

      utils.groups.getSettingsById.setData(queryVariables, {
        ...prevData,
        name: updatedGroup.name,
        description: updatedGroup.description,
      });
    },
  });

  const form = useForm<UpdateGroupInput>({
    defaultValues: {
      id: queryVariables.groupId,
      name: groupName,
      description: groupDescription,
    },
    resolver: zodResolver(updateGroupInput),
  });

  async function handleSubmit(data: UpdateGroupInput): Promise<void> {
    await toast.promise(updateMutation.mutateAsync(data), {
      loading: "Guardando...",
      success: "Guardado",
      error: handleToastError,
    });

    form.reset(data);
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Form className="w-full" onSubmit={form.handleSubmit(handleSubmit)}>
      <h1 className="text-2xl font-bold">General</h1>

      <Form.Input
        label="Nombre"
        {...form.register("name")}
        error={form.formState.errors.name?.message}
        required
      />

      <Form.Textarea
        label="Descripción"
        {...form.register("description")}
        error={form.formState.errors.description?.message}
      />

      <Button
        color="green"
        type="submit"
        className="flex items-center gap-2 self-end"
        loading={updateMutation.isLoading}
        disabled={!form.formState.isDirty}
      >
        <SaveIcon className="h-6 w-6 text-neutral-100" />
        Guardar
      </Button>
    </Form>
  );
};

export default GeneralSettings;
