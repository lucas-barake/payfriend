import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import {
  createGroupInput,
  type CreateGroupInput,
} from "$/server/api/routers/debts/mutations/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "$/components/ui/form";
import { Button } from "$/components/ui/button";
import { z } from "zod";
import { ArrowLeft, Plus, X } from "lucide-react";
import { type TabSetters } from "$/hooks/use-tabs/use-tabs";
import { type addDebtTabs } from "$/pages/dashboard/(page-lib)/components/add-debt-dialog/(component-lib)/add-debt-tabs";
import { Avatar } from "$/components/ui/avatar";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";

const formInput = z.object({
  borrowerEmail: z.string().email(),
});
type FormInput = z.infer<typeof formInput>;

type Props = {
  tabSetters: TabSetters<typeof addDebtTabs>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MembersForm: React.FC<Props> = ({ tabSetters, setOpen }) => {
  const session = useSession();
  const formContext = useFormContext<CreateGroupInput>();
  const form = useForm<FormInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(
      formInput.refine((v) => v.borrowerEmail !== session?.data?.user?.email, {
        message: "No puedes agregarte a ti mismo",
        path: ["borrowerEmail"],
      })
    ),
  });

  function addEmail(data: FormInput): void {
    const allEmails = formContext.getValues("borrowerEmails");

    if (allEmails.length === 0) {
      formContext.setValue("borrowerEmails", [data.borrowerEmail]);
      form.reset();
      return;
    }

    const newEmails = [...allEmails, data.borrowerEmail];
    const result = createGroupInput.shape.borrowerEmails.safeParse(newEmails);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message;
      form.setError("borrowerEmail", {
        type: "manual",
        message: errorMessage,
      });
      return;
    }
    form.reset();
    formContext.setValue("borrowerEmails", result.data);
  }

  const apiContext = api.useContext();
  const createMutation = api.debts.create.useMutation();

  async function handleCreate(): Promise<void> {
    const values = formContext.getValues();
    const result = createGroupInput.safeParse(values);
    if (!result.success) {
      toast.error(result.error.errors[0]?.message ?? "Error al crear grupo");
      return;
    }

    const newDebt = await toast.promise(
      createMutation.mutateAsync(result.data),
      {
        loading: "Creando grupo...",
        success: "Grupo creado",
        error: handleMutationError,
      }
    );
    apiContext.user.getOwnedDebts.setData(undefined, (prev) => ({
      debtsAsLender: [...(prev?.debtsAsLender ?? []), newDebt],
    }));

    setOpen(false);
    tabSetters.reset();
    formContext.reset();
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Form onSubmit={form.handleSubmit(addEmail)}>
      <Form.Group>
        <Form.Label htmlFor="borrowerEmail" required>
          Correo Electrónico
        </Form.Label>

        <div className="flex w-full items-center gap-2">
          <Form.Input
            id="borrowerEmail"
            {...form.register("borrowerEmail")}
            required
            error={form.formState.errors.borrowerEmail !== undefined}
            type="email"
            placeholder="Correo electrónico"
          />

          <Button type="submit" variant="success" size="sm">
            <Plus className="mr-2 h-5 w-5" />
            Agregar
          </Button>
        </div>

        <Form.FieldError
          message={form.formState.errors.borrowerEmail?.message}
        />
      </Form.Group>

      <div className="my-6 flex flex-col gap-4">
        {formContext.watch("borrowerEmails").map((email) => (
          <div className="flex items-center justify-between" key={email}>
            <div className="flex items-center gap-2">
              <Avatar>
                <Avatar.Fallback>{email[0]}</Avatar.Fallback>
              </Avatar>

              <span className="max-w-[175px] truncate sm:max-w-[300px]">
                {email}
              </span>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const newEmails = formContext
                  .getValues("borrowerEmails")
                  .filter((e) => e !== email);
                formContext.setValue("borrowerEmails", newEmails);
              }}
            >
              <span className="sr-only sm:not-sr-only">Eliminar</span>
              <span className="sm:sr-only">
                <X className="h-4 w-4" />
              </span>
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button
          variant="secondary"
          onClick={() => {
            tabSetters.prev();
          }}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Volver
        </Button>

        <Button
          onClick={() => {
            void handleCreate();
          }}
          loading={createMutation.isLoading}
        >
          Crear Deuda
        </Button>
      </div>
    </Form>
  );
};
export default MembersForm;
