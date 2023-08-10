import React from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import {
  type CreateDebtInput,
  generalInfoInput,
  type GeneralInfoInput,
  MAX_BIWEEKLY_DURATION,
  MAX_MONTHLY_DURATION,
  MAX_WEEKLY_DURATION,
  recurrentOptions,
} from "$/server/api/routers/debts/create-debt/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "$/components/ui/form";
import { Button } from "$/components/ui/button";
import { ArrowRight } from "lucide-react";
import { type TabSetters } from "$/hooks/use-tabs/use-tabs";
import { type addDebtTabs } from "$/pages/dashboard/(page-lib)/components/add-debt-dialog/(component-lib)/add-debt-tabs";
import { DatePicker } from "$/components/ui/date-picker";

type Props = {
  tabSetters: TabSetters<typeof addDebtTabs>;
};

const GeneralInfoForm: React.FC<Props> = ({ tabSetters }) => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;

  const formContext = useFormContext<CreateDebtInput>();
  const form = useForm<GeneralInfoInput>({
    defaultValues: {
      name: formContext.watch("generalInfo.name"),
      description: formContext.watch("generalInfo.description"),
      amount: formContext.watch("generalInfo.amount"),
      recurrency: formContext.watch("generalInfo.recurrency.recurrent")
        ? {
            recurrent: true,
            data: {
              frequency: formContext.watch(
                "generalInfo.recurrency.data.frequency"
              ),
              duration: formContext.watch(
                "generalInfo.recurrency.data.duration"
              ),
            },
          }
        : {
            recurrent: false,
            data: {
              frequency: undefined,
              duration: undefined,
            },
          },
      dueDate: formContext.watch("generalInfo.dueDate") ?? undefined,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(generalInfoInput),
  });
  const isRecurrent = form.watch("recurrency.recurrent");

  function handleSubmit(data: GeneralInfoInput): void {
    formContext.setValue("generalInfo.name", data.name);
    formContext.setValue("generalInfo.description", data.description);
    formContext.setValue("generalInfo.amount", data.amount);
    if (data.recurrency.recurrent) {
      formContext.setValue("generalInfo.recurrency.recurrent", true);
      formContext.setValue(
        "generalInfo.recurrency.data.frequency",
        data.recurrency.data.frequency
      );
      formContext.setValue(
        "generalInfo.recurrency.data.duration",
        data.recurrency.data.duration
      );
    } else {
      formContext.setValue("generalInfo.recurrency.recurrent", false);
      formContext.setValue("generalInfo.recurrency.data.frequency", undefined);
      formContext.setValue("generalInfo.recurrency.data.duration", undefined);
      formContext.setValue("generalInfo.dueDate", data.dueDate);
    }
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
          min={0}
        />

        {form.watch("amount") !== undefined && !isNaN(form.watch("amount")) && (
          <span className="text-sm text-muted-foreground">
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

      <Form.Group className="flex-row items-center">
        <Controller
          name="recurrency.recurrent"
          control={form.control}
          render={({ field }) => (
            <Form.Checkbox
              id="recurrent"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Form.Label htmlFor="recurrent">Recurrente</Form.Label>
      </Form.Group>

      {!isRecurrent && (
        <Form.Group>
          <Form.Label htmlFor="dueDate">Fecha de vencimiento</Form.Label>

          <Controller
            name="dueDate"
            control={form.control}
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />

          <Form.FieldError>
            {form.formState.errors.dueDate?.message}
          </Form.FieldError>
        </Form.Group>
      )}

      {isRecurrent && (
        <>
          <Form.Group>
            <Form.Label htmlFor="recurrentFrequency" required>
              Frecuencia
            </Form.Label>

            <Controller
              name="recurrency.data.frequency"
              control={form.control}
              render={({ field }) => (
                <Form.Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <Form.Select.Trigger>
                    <Form.Select.Value placeholder="Seleccione una opción" />
                  </Form.Select.Trigger>

                  <Form.Select.Content>
                    {recurrentOptions.map((option) => (
                      <Form.Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Form.Select.Item>
                    ))}
                  </Form.Select.Content>
                </Form.Select>
              )}
            />

            <Form.FieldError>
              {form.formState.errors.recurrency?.data?.frequency?.message}
            </Form.FieldError>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="recurrentDuration" required>
              Duración
            </Form.Label>

            <Controller
              name="recurrency.data.duration"
              control={form.control}
              render={({ field }) => {
                const frequency = form.watch("recurrency.data.frequency");
                const startValue = 2;

                return (
                  <Form.Select
                    defaultValue={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    <Form.Select.Trigger>
                      <Form.Select.Value placeholder="Seleccione una opción" />
                    </Form.Select.Trigger>

                    <Form.Select.Content>
                      {frequency === "WEEKLY" &&
                        Array.from({
                          length: MAX_WEEKLY_DURATION - startValue + 1,
                        }).map((_, index) => (
                          <Form.Select.Item
                            key={index}
                            value={String(index + startValue)}
                          >
                            {`${index + startValue} semanas`}
                          </Form.Select.Item>
                        ))}

                      {frequency === "BIWEEKLY" &&
                        Array.from({
                          length: MAX_BIWEEKLY_DURATION - startValue + 1,
                        }).map((_, index) => (
                          <Form.Select.Item
                            key={index}
                            value={String(index + startValue)}
                          >
                            {`${index + startValue} quincenas`}
                          </Form.Select.Item>
                        ))}

                      {frequency === "MONTHLY" &&
                        Array.from({
                          length: MAX_MONTHLY_DURATION - startValue + 1,
                        }).map((_, index) => (
                          <Form.Select.Item
                            key={index}
                            value={String(index + startValue)}
                          >
                            {`${index + startValue} meses`}
                          </Form.Select.Item>
                        ))}
                    </Form.Select.Content>
                  </Form.Select>
                );
              }}
            />

            <Form.FieldError>
              {form.formState.errors.recurrency?.data?.duration?.message}
            </Form.FieldError>
          </Form.Group>
        </>
      )}

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
