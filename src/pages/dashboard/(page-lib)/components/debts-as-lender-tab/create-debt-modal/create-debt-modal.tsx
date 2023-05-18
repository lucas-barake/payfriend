import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGroupInput,
  type CreateGroupInput,
} from "$/server/api/routers/debts/debts/mutations/input";
import { Form } from "src/components/ui/form";
import { Button } from "$/components/ui/button";
import { Modal, type ModalStateProps } from "$/components/ui/modal";
import { ArrowRight } from "lucide-react";

const CreateDebtModal: React.FC<ModalStateProps> = ({ show, onClose }) => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const form = useForm<CreateGroupInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(createGroupInput),
  });

  function afterClose(): void {
    form.reset();
  }

  function handleSubmit(data: CreateGroupInput): void {
    console.log(data);
  }

  return (
    <Modal
      title="Agregar Deuda"
      show={show}
      onClose={onClose}
      afterClose={afterClose}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
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

          <Form.FieldError message={form.formState.errors.name?.message} />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="description">Descripción</Form.Label>
          <Form.TextArea id="description" {...form.register("description")} />

          <Form.FieldError
            message={form.formState.errors.description?.message}
          />
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

          {form.watch("amount") !== undefined &&
            !isNaN(form.watch("amount")) && (
              <span className="text-sm text-gray-400">
                {form.watch("amount").toLocaleString(locale, {
                  style: "currency",
                  currency: "COP",
                })}
              </span>
            )}

          <Form.FieldError message={form.formState.errors.amount?.message} />
        </Form.Group>

        <Button
          type="submit"
          className="mt-4 flex flex-1 items-center justify-center py-2"
        >
          Siguiente
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Form>
    </Modal>
  );
};

export default CreateDebtModal;
