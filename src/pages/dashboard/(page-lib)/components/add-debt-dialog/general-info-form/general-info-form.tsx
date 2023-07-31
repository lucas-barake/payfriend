import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import {
  createDebtInput,
  type CreateDebtInput,
} from "$/server/api/routers/debts/mutations/handlers/create/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "$/components/ui/form";
import { Button } from "$/components/ui/button";
import { ArrowRight } from "lucide-react";
import { type z } from "zod";
import { type TabSetters } from "$/hooks/use-tabs/use-tabs";
import { type addDebtTabs } from "$/pages/dashboard/(page-lib)/components/add-debt-dialog/(component-lib)/add-debt-tabs";

const formInput = createDebtInput.pick({
  name: true,
  description: true,
  amount: true,
});
type FormInput = z.infer<typeof formInput>;

type Props = {
  tabSetters: TabSetters<typeof addDebtTabs>;
};

const GeneralInfoForm: React.FC<Props> = ({ tabSetters }) => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;

  const formContext = useFormContext<CreateDebtInput>();
  const form = useForm<FormInput>({
    defaultValues: {
      name: formContext.watch("name"),
      description: formContext.watch("description"),
      amount: formContext.watch("amount"),
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(formInput),
  });

  function handleSubmit(data: FormInput): void {
    formContext.setValue("name", data.name);
    formContext.setValue("description", data.description);
    formContext.setValue("amount", data.amount);
    tabSetters.next();
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <Form.Group>
        <Form.Label htmlFor="name" required>
          Nombre
        </Form.Label>
        <Form.Input
          id="name"
          {...form.register("name")}
          required
          error={form.formState.errors.name !== undefined}
        />

        <Form.FieldError>{form.formState.errors.name?.message}</Form.FieldError>
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="description">Descripción</Form.Label>
        <Form.TextArea id="description" {...form.register("description")} />

        <Form.FieldError>
          {form.formState.errors.description?.message}
        </Form.FieldError>
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="amount" required>
          Monto
        </Form.Label>
        <Form.Input
          id="amount"
          type="number"
          {...form.register("amount", { valueAsNumber: true })}
          required
          error={form.formState.errors.amount !== undefined}
        />

        {form.watch("amount") !== undefined && !isNaN(form.watch("amount")) && (
          <span className="text-sm text-gray-400">
            {form.watch("amount").toLocaleString(locale, {
              style: "currency",
              currency: "COP",
            })}
          </span>
        )}

        <Form.FieldError>
          {form.formState.errors.amount?.message}
        </Form.FieldError>
      </Form.Group>

      <Button
        type="submit"
        className="mt-4 flex flex-1 items-center justify-center py-2"
      >
        Siguiente
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </Form>
  );
};

export default GeneralInfoForm;
