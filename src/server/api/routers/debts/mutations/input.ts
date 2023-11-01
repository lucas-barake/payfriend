import { z } from "zod";
import { type DebtRecurringFrequency } from "@prisma/client";
import { DateTime } from "luxon";

export const CURRENCIES = [
  "COP",
  "USD",
  "MXN",
  "EUR",
  "UYU",
  "ARS",
  "CLP",
  "BRL",
  "PYG",
  "PEN",
  "GBP",
] as const;
export type Currency = typeof CURRENCIES[number] | string;
export const DEBT_MAX_BORROWERS = 4;
export const DEBT_MAX_WEEKLY_DURATION = 8;
export const DEBT_MAX_BIWEEKLY_DURATION = 6;
export const DEBT_MAX_MONTHLY_DURATION = 12;

export const createDebtRecurrentOptions = [
  {
    label: "Semanal",
    value: "WEEKLY",
  },
  {
    label: "Quincenal",
    value: "BIWEEKLY",
  },
  {
    label: "Mensual",
    value: "MONTHLY",
  },
] satisfies Array<{
  label: string;
  value: DebtRecurringFrequency;
}>;

export const createDebtTypeOptions = [
  {
    label: "Única",
    value: "SINGLE",
  },
  {
    label: "Recurrente",
    value: "RECURRENT",
  },
] satisfies Array<{
  label: string;
  value: "SINGLE" | "RECURRENT";
}>;

export const generalInfoInput = z
  .object({
    name: z
      .string({
        invalid_type_error: "El nombre debe ser un string",
        required_error: "El nombre es requerido",
      })
      .trim()
      .min(1, {
        message: "El nombre es requerido",
      })
      .max(50, {
        message: "El nombre debe tener menos de 40 caracteres",
      }),
    description: z
      .string({
        invalid_type_error: "La descripción debe ser un string",
      })
      .trim()
      .max(100, {
        message: "La descripción debe tener menos de 100 caracteres",
      })
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    amount: z
      .number()
      .gte(1, {
        message: "La cantidad debe ser mayor a 0",
      })
      .lte(1_000_000_000, {
        message: "La cantidad debe ser menor o igual a 1,000,000,000",
      })
      .multipleOf(0.01, "La cantidad debe ser múltiplo de 0.01"),
    currency: z.enum(CURRENCIES),
    dueDate: z
      .string()
      .refine((iso) => DateTime.fromISO(iso).isValid, "Fecha inválida")
      .transform((iso) => DateTime.fromISO(iso).toUTC().toISO())
      .refine((iso) => {
        const now = DateTime.now().toUTC();
        const dueDate = DateTime.fromISO(iso).toUTC();
        return dueDate > now;
      }, "La fecha de vencimiento debe ser mayor a hoy")
      .nullable(),
    type: z.enum(
      createDebtTypeOptions.map((option) => option.value) as [
        string,
        ...string[]
      ]
    ),
    recurrency: z
      .object({
        frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"], {
          invalid_type_error: "Debes seleccionar una frecuencia de recurrencia",
          required_error: "Debes seleccionar una frecuencia de recurrencia",
        }),
        duration: z
          .number({
            coerce: true,
            invalid_type_error: "Debes seleccionar una duración",
            required_error: "Debes seleccionar una duración",
          })
          .gte(2, {
            message: "La duración debe ser mayor a 1",
          }),
      })
      .superRefine((arg, ctx) => {
        if (arg.frequency === "WEEKLY") {
          if (arg.duration > DEBT_MAX_WEEKLY_DURATION) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `WEEKLY - La duración debe ser menor a ${DEBT_MAX_WEEKLY_DURATION}`,
              path: ["recurrency", "duration"],
            });
          }
        }

        if (arg.frequency === "BIWEEKLY") {
          if (arg.duration > DEBT_MAX_BIWEEKLY_DURATION) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `BIWEEKLY - La duración debe ser menor a ${DEBT_MAX_BIWEEKLY_DURATION}`,
              path: ["recurrency", "duration"],
            });
          }
        }

        if (arg.frequency === "MONTHLY") {
          if (arg.duration > DEBT_MAX_MONTHLY_DURATION) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `MONTHLY - La duración debe ser menor a ${DEBT_MAX_MONTHLY_DURATION}`,
              path: ["recurrency", "duration"],
            });
          }
        }
      })
      .nullable(),
  })
  .superRefine((arg, ctx) => {
    if (arg.type === "RECURRENT" && arg.recurrency === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes agregar una recurrencia",
        path: ["recurrency"],
      });
    }
  });
export type GeneralInfoInput = z.infer<typeof generalInfoInput>;

export const createDebtInput = z.object({
  generalInfo: generalInfoInput,
  borrowerEmails: z
    .array(z.string().email("Debes agregar un correo válido"))
    .min(1, {
      message: "Debes agregar al menos un correo",
    })
    .max(DEBT_MAX_BORROWERS, {
      message: `No puedes agregar más de ${DEBT_MAX_BORROWERS} correos`,
    })
    .refine((emails) => {
      const uniqueEmails = new Set(emails);
      return uniqueEmails.size === emails.length;
    }, "No puedes agregar correos duplicados"),
});
export type CreateDebtInput = z.infer<typeof createDebtInput>;

export const defaultCreateDebtInput = {
  borrowerEmails: [],
  generalInfo: {
    amount: 0,
    currency: "COP",
    name: "",
    description: null,
    dueDate: null,
    recurrency: null,
    type: "SINGLE",
  },
} satisfies CreateDebtInput;
