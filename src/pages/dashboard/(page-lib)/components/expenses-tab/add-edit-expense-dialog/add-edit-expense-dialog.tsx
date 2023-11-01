import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  createPersonalExpenseInput,
  type CreatePersonalExpenseInput,
} from "$/server/api/routers/personal-expenses/mutations/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "$/components/ui/dialog";
import { Button } from "$/components/ui/button";
import { Form } from "$/components/ui/form";
import { CurrencyInput } from "$/components/ui/currency-input";
import { CURRENCIES } from "$/server/api/routers/debts/mutations/input";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";
import { type GetPersonalExpensesResult } from "$/server/api/routers/personal-expenses/queries/types";

type Props = {
  editingExpense?: GetPersonalExpensesResult["expenses"][number];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddEditExpenseDialog: React.FC<Props> = ({
  editingExpense,
  open,
  setOpen,
}) => {
  const isEditing = editingExpense !== undefined;

  const apiContext = api.useUtils();
  const createMutation = api.personalExpenses.create.useMutation();
  const editMutation = api.personalExpenses.edit.useMutation();

  const form = useForm<CreatePersonalExpenseInput>({
    defaultValues: {
      currency: editingExpense?.currency ?? "COP",
      name: editingExpense?.name ?? "",
      amount: editingExpense?.amount ?? 0,
      description: editingExpense?.description ?? "",
    },
    resolver: zodResolver(createPersonalExpenseInput),
  });

  async function handleSubmit(data: CreatePersonalExpenseInput): Promise<void> {
    if (isEditing) {
      await toast.promise(
        editMutation.mutateAsync({
          ...data,
          id: editingExpense.id,
        }),
        {
          loading: "Editando gasto...",
          success: "Gasto editado",
          error: handleMutationError,
        }
      );
    } else {
      await toast.promise(createMutation.mutateAsync(data), {
        loading: "Creando gasto...",
        success: "Gasto creado",
        error: handleMutationError,
      });
    }
    await apiContext.personalExpenses.get.invalidate();
    setOpen(false);

    if (isEditing) {
      form.reset(data);
    } else {
      form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>
            {isEditing ? "Editar Gasto" : "Agregar Gasto"}
          </Dialog.Title>

          {!isEditing && (
            <Dialog.Description>
              Agrega un gasto a tu lista de gastos personales.
            </Dialog.Description>
          )}
        </Dialog.Header>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Form onSubmit={form.handleSubmit(handleSubmit)}>
          <Form.Group>
            <Form.Label htmlFor="name" required>
              Nombre del gasto
            </Form.Label>

            <Form.Input {...form.register("name")} />

            <Form.FieldError>
              {form.formState.errors.name?.message}
            </Form.FieldError>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="amount" required>
              Monto
            </Form.Label>

            <div className="flex gap-1">
              <Controller
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <CurrencyInput
                    currency={form.watch("currency")}
                    value={field.value}
                    onChange={(args) => {
                      field.onChange(args.value);
                    }}
                  />
                )}
              />

              <Controller
                name="currency"
                control={form.control}
                render={({ field }) => (
                  <Form.Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <Form.Select.Trigger className="h-full w-24">
                      <Form.Select.Value placeholder="Seleccione una opción" />
                    </Form.Select.Trigger>

                    <Form.Select.Content align="end">
                      {CURRENCIES.map((value) => (
                        <Form.Select.Item key={value} value={value}>
                          {value}
                        </Form.Select.Item>
                      ))}
                    </Form.Select.Content>
                  </Form.Select>
                )}
              />
            </div>

            <Form.FieldError>
              {form.formState.errors.amount?.message}
            </Form.FieldError>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="description">Descripción</Form.Label>

            <Form.TextArea {...form.register("description")} />

            <Form.FieldError>
              {form.formState.errors.description?.message}
            </Form.FieldError>
          </Form.Group>

          <Dialog.Footer>
            <Button type="submit" loading={createMutation.isLoading}>
              {isEditing ? "Editar" : "Agregar"}
            </Button>

            <Dialog.Trigger asChild>
              <Button variant="secondary">Cancelar</Button>
            </Dialog.Trigger>
          </Dialog.Footer>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

export default AddEditExpenseDialog;
