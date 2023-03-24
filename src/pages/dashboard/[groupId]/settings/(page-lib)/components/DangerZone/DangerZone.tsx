import { type FC, useState } from "react";
import Button from "$/components/Button";
import { TrashIcon } from "@heroicons/react/outline";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import handleToastError from "$/components/StyledToaster/handleToastError";
import { type DebtTable } from ".prisma/client";
import Modal from "$/components/Modal";
import { useRouter } from "next/router";

type Props = {
  groupId: DebtTable["id"];
};

const DangerZone: FC<Props> = ({ groupId }) => {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteMutation = api.groups.delete.useMutation();

  async function handleDelete(): Promise<void> {
    await toast.promise(
      deleteMutation.mutateAsync({
        groupId,
      }),
      {
        loading: "Eliminando grupo...",
        success: "Grupo eliminado",
        error: handleToastError,
      }
    );

    await router.push("/dashboard");
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <Modal
        show={showDeleteModal}
        onClose={setShowDeleteModal}
        title="Eliminar grupo"
      >
        <p className="text-lg">
          ¿Estás seguro de que quieres eliminar este grupo?
        </p>

        <div className="mt-12 flex justify-end gap-2">
          <Button
            color="gray"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            Cancelar
          </Button>

          <Button
            color="red"
            onClick={() => {
              void handleDelete();
            }}
            loading={deleteMutation.isLoading}
          >
            Eliminar
          </Button>
        </div>
      </Modal>

      <h1 className="text-2xl font-bold">Zona de Peligro</h1>

      <Button
        color="red"
        className="flex items-center gap-2 self-start"
        onClick={() => {
          setShowDeleteModal(true);
        }}
      >
        <TrashIcon className="h-6 w-6" />
        Eliminar grupo
      </Button>
    </div>
  );
};

export default DangerZone;
