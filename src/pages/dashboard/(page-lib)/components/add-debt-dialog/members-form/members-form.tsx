import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import {
  createDebtInput,
  type CreateDebtInput,
  MAX_BORROWERS,
} from "$/server/api/routers/debts/mutations/handlers/create-debt/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "$/components/ui/form";
import { Button } from "$/components/ui/button";
import { z } from "zod";
import { ArrowLeft, Plus } from "lucide-react";
import { type TabSetters } from "$/hooks/use-tabs/use-tabs";
import { type addDebtTabs } from "$/pages/dashboard/(page-lib)/components/add-debt-dialog/(component-lib)/add-debt-tabs";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";
import { useFreePlanLimit } from "$/hooks/use-free-plan-limit";
import { type LenderDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-owned-debts/input";
import RecentEmailsPopover from "$/pages/dashboard/(page-lib)/components/recent-emails-popover/recent-emails-popover";
import MemberRow from "$/pages/dashboard/(page-lib)/components/add-debt-dialog/members-form/member-row";

const formInput = z.object({
  borrowerEmail: z.string().email("Email inválido"),
});
type FormInput = z.infer<typeof formInput>;

type Props = {
  tabSetters: TabSetters<typeof addDebtTabs>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  queryVariables: LenderDebtsQueryInput;
};

const MembersForm: React.FC<Props> = ({
  tabSetters,
  setOpen,
  queryVariables,
}) => {
  const session = useSession();
  const formContext = useFormContext<CreateDebtInput>();
  const freePlanLimit = useFreePlanLimit();
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
  const borrowerEmails = formContext.watch("borrowerEmails");

  function addEmail(data: FormInput): void {
    const allEmails = formContext.getValues("borrowerEmails");

    if (allEmails.length === 0) {
      formContext.setValue("borrowerEmails", [data.borrowerEmail]);
      form.reset();
      return;
    }

    const newEmails = [...allEmails, data.borrowerEmail];
    const result = createDebtInput.shape.borrowerEmails.safeParse(newEmails);
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
  const createMutation = api.debts.createDebt.useMutation();

  async function handleCreate(): Promise<void> {
    const values = formContext.getValues();
    const result = createDebtInput.safeParse(values);
    if (!result.success) {
      toast.error(result.error.errors[0]?.message ?? "Error al crear grupo");
      return;
    }

    await toast.promise(createMutation.mutateAsync(result.data), {
      loading: "Creando deuda...",
      success: "Deuda creada",
      error: handleMutationError,
    });
    await apiContext.debts.getOwnedDebts.invalidate(queryVariables);
    await freePlanLimit.invalidateQuery();

    setOpen(false);
    tabSetters.reset();
    formContext.reset();
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Form onSubmit={form.handleSubmit(addEmail)}>
      <Form.Group>
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <Form.Label htmlFor="borrowerEmail" required>
            Correo Electrónico
          </Form.Label>

          <RecentEmailsPopover
            onSelect={(email) => {
              if (borrowerEmails.includes(email)) {
                formContext.setValue(
                  "borrowerEmails",
                  borrowerEmails.filter((e) => e !== email)
                );
                form.clearErrors("borrowerEmail");
              } else {
                addEmail({ borrowerEmail: email });
              }
            }}
            currentEmails={borrowerEmails}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
          <Form.Input
            id="borrowerEmail"
            {...form.register("borrowerEmail")}
            required
            error={form.formState.errors.borrowerEmail !== undefined}
            type="email"
            placeholder="Correo electrónico"
          />

          <Button
            type="submit"
            variant="success"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-5 w-5" />
            Agregar
          </Button>
        </div>

        <Form.FieldDescription
          hide={form.formState.errors.borrowerEmail !== undefined}
        >
          Máximo {MAX_BORROWERS} correos
        </Form.FieldDescription>

        <Form.FieldError>
          {form.formState.errors.borrowerEmail?.message}
        </Form.FieldError>
      </Form.Group>

      <div className="my-6 flex flex-col gap-4">
        {formContext.watch("borrowerEmails").map((email) => (
          <MemberRow
            onRemove={() => {
              const newEmails = formContext
                .getValues("borrowerEmails")
                .filter((e) => e !== email);
              formContext.setValue("borrowerEmails", newEmails);
              form.clearErrors("borrowerEmail");
            }}
            email={email}
            key={email}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button
          variant="secondary"
          onClick={() => {
            tabSetters.prev();
          }}
          disabled={createMutation.isLoading}
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
