import { type FC } from "react";
import { Button } from "$/components/ui/button";
import { TrashIcon } from "@heroicons/react/outline";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { useRouter } from "next/router";
import { type GetSettingsInput } from "$/server/api/routers/groups/groups/get-settings-by-id/input";
import { Dialog } from "$/components/ui/dialog";

type Props = {
  queryVariables: GetSettingsInput;
};

const DangerZone: FC<Props> = ({ queryVariables }) => {
  const router = useRouter();
  const utils = api.useContext();
  const deleteMutation = api.groups.deleteGroup.useMutation();

  async function handleDelete(): Promise<void> {
    await toast.promise(
      deleteMutation.mutateAsync({
        groupId: queryVariables.groupId,
      }),
      {
        loading: "Eliminando grupo...",
        success: "Grupo eliminado",
        error: handleToastError,
      }
    );

    await utils.user.getOwnedGroups.invalidate();
    await utils.groups.getGroupById.invalidate({
      id: queryVariables.groupId,
    });

    await router.push("/dashboard");
  }

  return (
    <Dialog modal>
      <Dialog.Content className="w-1/5">
        <div className="flex w-full flex-col gap-3">
          <Dialog.Title>Eliminar Grupo</Dialog.Title>

          <Dialog.Description>
            ¿Estás seguro de que quieres eliminar este grupo?
          </Dialog.Description>

          <Dialog.Footer className="mt-6 flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                void handleDelete();
              }}
              loading={deleteMutation.isLoading}
            >
              Eliminar
            </Button>

            <Dialog.Trigger asChild>
              <Button variant="secondary">Cancelar</Button>
            </Dialog.Trigger>
          </Dialog.Footer>
        </div>
      </Dialog.Content>

      <h1 className="self-start text-2xl font-bold">Zona de Peligro</h1>

      <Dialog.Trigger asChild>
        <Button
          variant="destructive"
          className="flex items-center gap-2 self-start"
        >
          <TrashIcon className="h-6 w-6" />
          Eliminar grupo
        </Button>
      </Dialog.Trigger>
    </Dialog>
  );
};

export default DangerZone;
