import { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGroupInput,
  type CreateGroupInput,
} from "$/server/api/routers/groups/mutations/createAndUpdate/input";
import Modal from "$/components/Modal/Modal";
import Form from "$/components/Form";
import Button from "$/components/Button";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";

type Props = {
  show: boolean;
  onClose: () => void;
};

const CreateGroupModal: FC<Props> = ({ show, onClose }) => {
  const utils = api.useContext();
  const create = api.groups.create.useMutation({
    onSuccess: (newTable) => {
      const prevData = utils.groups.getAll.getData();

      utils.groups.getAll.setData(
        undefined,
        prevData != null ? [newTable, ...prevData] : [newTable]
      );

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

  function afterClose(): void {
    form.reset();
    create.reset();
  }

  async function handleSubmit(data: CreateGroupInput): Promise<void> {
    await toast.promise(create.mutateAsync(data), {
      loading: "Creando grupo...",
      success() {
        onClose();
        return "Grupo creado";
      },
      error: handleToastError,
    });

    onClose();
  }

  return (
    <Modal
      show={show}
      onClose={onClose}
      afterClose={afterClose}
      title="Crear Grupo"
    >
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <Form.Input
          label="Nombre"
          {...form.register("name")}
          required
          error={form.formState.errors.name?.message}
        />
        <Form.Textarea
          label="Descripción"
          {...form.register("description")}
          error={form.formState.errors.description?.message}
        />

        {form.formState.errors.root?.message !== undefined && (
          <span className="text-sm text-red-500">
            {form.formState.errors.root?.message}
          </span>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Button
            color="indigo"
            type="submit"
            loading={create.isLoading}
            className="flex flex-1 items-center justify-center py-2"
          >
            Crear Grupo
          </Button>

          <Button
            color="neutral"
            outline
            onClick={onClose}
            className="flex flex-1 items-center justify-center py-2"
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateGroupModal;
