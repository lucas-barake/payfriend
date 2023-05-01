import { type FC } from "react";
import { Button } from "$/components/ui/button";
import { TrashIcon } from "@heroicons/react/outline";
import { api } from "$/utils/api";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { useRouter } from "next/router";
import { type GetSettingsInput } from "$/server/api/routers/groups/groups/get-settings-by-id/input";
import { Sheet } from "$/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "$/components/ui/form";

type Props = {
  queryVariables: GetSettingsInput;
};

const DangerZone: FC<Props> = ({ queryVariables }) => {
  const router = useRouter();
  const utils = api.useContext();
  const deleteMutation = api.groups.deleteGroup.useMutation();

  const form = useForm({
    defaultValues: {
      confirmation: "",
    },
    resolver: zodResolver(
      z.object({
        confirmation: z
          .string()
          .trim()
          .refine((value) => value === "Eliminar", {
            message: "Debes escribir 'Eliminar' para confirmar",
          }),
      })
    ),
    mode: "onChange",
    reValidateMode: "onChange",
  });

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
    <Sheet
      onOpenChange={() => {
        form.reset();
      }}
    >
      <Sheet.Content size="sm">
        <div className="flex w-full flex-col gap-3">
          <Sheet.Title>Eliminar Grupo</Sheet.Title>

          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Form onSubmit={form.handleSubmit(handleDelete)}>
            <Form.Input
              label="Escribe 'eliminar' para confirmar"
              {...form.register("confirmation")}
            />

            <div className="mt-4 flex items-center justify-end gap-4">
              <Button
                variant="destructive"
                type="submit"
                loading={deleteMutation.isLoading}
                disabled={!form.formState.isValid}
              >
                Eliminar
              </Button>

              <Sheet.Trigger asChild>
                <Button variant="secondary">Cancelar</Button>
              </Sheet.Trigger>
            </div>
          </Form>
        </div>
      </Sheet.Content>

      <span className="self-start text-xl font-bold">Zona de Peligro</span>

      <Sheet.Trigger asChild>
        <Button
          variant="destructive"
          className="flex items-center gap-2 self-start"
        >
          <TrashIcon className="h-6 w-6" />
          Eliminar grupo
        </Button>
      </Sheet.Trigger>
    </Sheet>
  );
};

export default DangerZone;
