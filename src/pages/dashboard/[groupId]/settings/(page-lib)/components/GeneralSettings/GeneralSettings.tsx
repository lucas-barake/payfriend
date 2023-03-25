import { type FC } from "react";
import { type DebtTable } from ".prisma/client";
import { useForm } from "react-hook-form";
import Form from "$/components/Form";
import Button from "$/components/Button";
import { SaveIcon } from "@heroicons/react/outline";
import {
  updateGroupInput,
  type UpdateGroupInput,
} from "$/server/api/routers/groups/mutations/createAndUpdate/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";
import { type GetSettingsInput } from "$/server/api/routers/groups/queries/getSettingsHandler/input";

type Props = {
  groupName: DebtTable["name"];
  groupDescription: DebtTable["description"];
  queryVariables: GetSettingsInput;
};

const GeneralSettings: FC<Props> = ({
  groupName,
  groupDescription,
  queryVariables,
}) => {
  const utils = api.useContext();
  const updateMutation = api.groups.update.useMutation();

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

    await utils.groups.getUserOwned.invalidate();
    await utils.groups.getById.invalidate({
      id: queryVariables.groupId,
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
