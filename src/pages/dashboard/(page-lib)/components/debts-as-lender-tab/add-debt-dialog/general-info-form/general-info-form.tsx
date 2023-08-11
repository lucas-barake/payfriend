import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  type CreateDebtInput,
  CURRENCIES,
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
import { ArrowRight, EyeIcon } from "lucide-react";
import { type TabSetters } from "$/hooks/use-tabs/use-tabs";
import { type addDebtTabs } from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/add-debt-dialog/(component-lib)/add-debt-tabs";
import { DatePicker } from "$/components/ui/date-picker";
import { formatCurrency } from "$/lib/utils/format-currency";
import { DateTime } from "luxon";
import RecurringCyclesDialog from "$/pages/dashboard/(page-lib)/components/recurring-cycles-dialog";

function roundToTwoDecimals(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

type Props = {
  tabSetters: TabSetters<typeof addDebtTabs>;
  formData: CreateDebtInput;
  setFormData: React.Dispatch<React.SetStateAction<CreateDebtInput>>;
};

const GeneralInfoForm: React.FC<Props> = ({
  tabSetters,
  setFormData,
  formData,
}) => {
  const [openCyclesInfo, setOpenCyclesInfo] = React.useState(false);

  const form = useForm<GeneralInfoInput>({
    defaultValues: formData.generalInfo,
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(generalInfoInput),
  });
  const isRecurrent = form.watch("recurrency.recurrent");

  function handleSubmit(data: GeneralInfoInput): void {
    setFormData((prev) => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        name: data.name,
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        recurrency: isRecurrent
          ? data.recurrency
          : {
              recurrent: false,
              data: {
                frequency: undefined,
                duration: undefined,
              },
            },
        dueDate: isRecurrent ? null : data.dueDate,
      },
    }));
    tabSetters.next();
  }

  return (
    <React.Fragment>
      {isRecurrent && (
        <RecurringCyclesDialog
          open={openCyclesInfo}
          onOpenChange={setOpenCyclesInfo}
          recurringFrequency={form.watch("recurrency.data.frequency")!}
          duration={form.watch("recurrency.data.duration")!}
          createdAt={DateTime.now().toJSDate()}
        />
      )}

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises*/}
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

          <Form.FieldError>
            {form.formState.errors.name?.message}
          </Form.FieldError>
        </Form.Group>

        <Form.Group>
          <div className="flex items-center gap-3">
            <Form.Label htmlFor="amount" required>
              Cantidad
            </Form.Label>

            {isRecurrent && (
              <Button
                className="self-start text-sm"
                variant="outline"
                onClick={() => {
                  form.setValue(
                    "amount",
                    roundToTwoDecimals(
                      form.watch("amount") /
                        form.watch("recurrency.data.duration")!
                    )
                  );
                }}
                size="sm"
              >
                Dividir en periodos
              </Button>
            )}
          </div>

          <div className="flex gap-1">
            <Form.Input
              id="amount"
              type="number"
              {...form.register("amount", { valueAsNumber: true })}
              required
              error={form.formState.errors.amount !== undefined}
              min={0}
              step={0.01}
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

          {form.watch("amount") !== undefined &&
            !isNaN(form.watch("amount")) && (
              <span className="text-sm text-muted-foreground">
                {formatCurrency(form.watch("amount"), form.watch("currency"))}
              </span>
            )}

          <Form.FieldError>
            {form.formState.errors.amount?.message}
          </Form.FieldError>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="description">Descripción</Form.Label>
          <Form.TextArea id="description" {...form.register("description")} />

          <Form.FieldError>
            {form.formState.errors.description?.message}
          </Form.FieldError>
        </Form.Group>

        {!isRecurrent && (
          <Form.Group>
            <Form.Label htmlFor="dueDate">Fecha de vencimiento</Form.Label>

            <Controller
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? undefined}
                  onChange={(date) => {
                    if (date === undefined) {
                      field.onChange(null);
                      return;
                    }
                    field.onChange(DateTime.fromJSDate(date).toUTC().toISO());
                  }}
                />
              )}
            />

            <Form.FieldError>
              {form.formState.errors.dueDate?.message}
            </Form.FieldError>
          </Form.Group>
        )}

        <Form.Group className="flex-row items-center">
          <Controller
            name="recurrency.recurrent"
            control={form.control}
            render={({ field }) => (
              <Form.Checkbox
                id="recurrent"
                checked={field.value}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    form.setValue("recurrency.data.frequency", undefined);
                    form.setValue("recurrency.data.duration", undefined);
                    form.setValue("recurrency.recurrent", false);
                  } else {
                    form.setValue("recurrency.data.frequency", "MONTHLY");
                    form.setValue("recurrency.data.duration", 2);
                    form.setValue("recurrency.recurrent", true);
                  }
                }}
              />
            )}
          />
          <Form.Label htmlFor="recurrent">Recurrente</Form.Label>
        </Form.Group>

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
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("recurrency.data.duration", 2);
                    }}
                  >
                    <Form.Select.Trigger>
                      <Form.Select.Value placeholder="Seleccione una opción" />
                    </Form.Select.Trigger>

                    <Form.Select.Content>
                      {recurrentOptions.map((option) => (
                        <Form.Select.Item
                          key={option.value}
                          value={option.value}
                        >
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

        {isRecurrent && (
          <Button
            className="flex items-center justify-center gap-2 self-start py-2"
            variant="outline"
            onClick={() => {
              setOpenCyclesInfo(true);
            }}
          >
            <EyeIcon className="h-5 w-5" />
            Ver periodos
          </Button>
        )}

        <Button
          type="submit"
          className="mt-4 flex flex-1 items-center justify-center py-2"
        >
          Siguiente
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default GeneralInfoForm;
