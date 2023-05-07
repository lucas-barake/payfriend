import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Form } from "src/components/ui/form";
import { Button } from "$/components/ui/button";
import {
  updateGroupInput,
  type UpdateGroupInput,
} from "$/server/api/routers/groups/groups/create-update/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { type GetSettingsInput } from "$/server/api/routers/groups/groups/get-settings-by-id/input";
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
      if (prevData === undefined) return;

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
      <span className="text-xl font-bold">General</span>

      <Form.Input
        label="Nombre"
        {...form.register("name")}
        error={form.formState.errors.name?.message}
        required
      />

      <Form.TextArea
        label="Descripción"
        {...form.register("description")}
        error={form.formState.errors.description?.message}
      />

      <Button
        type="submit"
        variant={!form.formState.isDirty ? "secondary" : "success"}
        className="self-end"
        loading={updateMutation.isLoading}
        disabled={!form.formState.isDirty}
      >
        Guardar
      </Button>
    </Form>
  );
};

export default GeneralSettings;
