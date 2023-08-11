import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { Form } from "$/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import {
  addPaymentInput,
  type AddPaymentInput,
} from "$/server/api/routers/debts/payments/add-payment/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "$/components/ui/button";
import { type DebtsAsBorrowerResult } from "$/server/api/routers/debts/get-debts/debts-as-borrower/types";
import { useSession } from "next-auth/react";
import { formatCurrency } from "$/lib/utils/format-currency";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";
import { type DebtsAsBorrowerInput } from "$/server/api/routers/debts/get-debts/debts-as-borrower/input";
import { PaymentStatus } from "@prisma/client";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debt: DebtsAsBorrowerResult["debts"][number];
  queryVariables: DebtsAsBorrowerInput;
};

const AddPaymentDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  debt,
  queryVariables,
}) => {
  const session = useSession();
  const borrower = debt.borrowers.find(
    (borrower) => borrower.user.id === session.data?.user?.id
  );
  const form = useForm<AddPaymentInput>({
    defaultValues: {
      fullPayment: true,
      amount: null,
      debtId: debt.id,
    },
    mode: "onChange",
    resolver: zodResolver(
      addPaymentInput.superRefine((arg, ctx) => {
        if (!arg.fullPayment && arg.amount > (borrower?.balance ?? 0)) {
          ctx.addIssue({
            code: "custom",
            message: "El pago no puede ser mayor a la deuda.",
            path: ["amount"],
          });
        }
      })
    ),
  });
  const borrowerBalance = borrower?.balance ?? 0;
  const isFullPayment = form.watch("fullPayment");
  const addPaymentMutation = api.debts.addPayment.useMutation();
  const apiContext = api.useContext();

  async function handleSubmit(data: AddPaymentInput): Promise<void> {
    const result = await toast.promise(addPaymentMutation.mutateAsync(data), {
      loading: "Agregando pago...",
      success: "Pago agregado exitosamente.",
      error: handleMutationError,
    });

    apiContext.debts.getSharedDebts.setData(queryVariables, (cache) => {
      if (cache === undefined) return cache;

      return {
        debts: cache.debts.map((cachedDebt) => {
          if (cachedDebt.id !== debt.id) return cachedDebt;
          return {
            ...cachedDebt,
            borrowers: cachedDebt.borrowers.map((cachedBorrower) => {
              if (cachedBorrower.user.id === session.data?.user?.id) {
                return {
                  ...cachedBorrower,
                  balance: result.newBalance,
                  payments: [
                    ...cachedBorrower.payments,
                    {
                      amount: result.amount,
                      status: PaymentStatus.PENDING_CONFIRMATION,
                      id: result.newPaymentId,
                    },
                  ],
                };
              }
              return cachedBorrower;
            }),
          };
        }),
        count: cache.count,
      } satisfies DebtsAsBorrowerResult;
    });

    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Agregar Pago</Dialog.Title>

          <Dialog.Description>
            Abona o haz un pago total de la deuda. El prestador luego podrá
            confirmarlo.
          </Dialog.Description>
        </Dialog.Header>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Form onSubmit={form.handleSubmit(handleSubmit)}>
          <Form.Group className="flex-row items-center">
            <Controller
              name="fullPayment"
              control={form.control}
              render={({ field }) => (
                <Form.Checkbox
                  id="fullPayment"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      form.setValue("amount", null);
                    }
                  }}
                />
              )}
            />
            <Form.Label htmlFor="fullPayment">Pago Total</Form.Label>
          </Form.Group>

          {!isFullPayment && (
            <Form.Group>
              <Form.Label>Cantidad</Form.Label>
              <Form.Input
                type="number"
                placeholder={`Máximo ${formatCurrency(borrowerBalance)}`}
                {...form.register("amount", {
                  valueAsNumber: true,
                })}
              />

              <Form.FieldError>
                {form.formState.errors.amount?.message}
              </Form.FieldError>
            </Form.Group>
          )}

          <span className="text-sm">
            Vas a pagar{" "}
            <span className="font-bold">
              {isFullPayment
                ? formatCurrency(borrowerBalance, debt.currency)
                : formatCurrency(form.watch("amount") as number, debt.currency)}
            </span>{" "}
            de{" "}
            <span className="font-bold">{formatCurrency(borrowerBalance)}</span>{" "}
          </span>

          <Dialog.Footer>
            <Button
              size="sm"
              type="submit"
              loading={addPaymentMutation.isLoading}
              disabled={borrower?.balance === 0}
            >
              Confirmar
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
          </Dialog.Footer>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

export default AddPaymentDialog;
