import { z } from "zod";
import { type DebtRecurringFrequency } from "@prisma/client";
import { DateTime } from "luxon";

export const MAX_BORROWERS = 4;
export const MAX_WEEKLY_DURATION = 8;
export const MAX_BIWEEKLY_DURATION = 6;
export const MAX_MONTHLY_DURATION = 12;

export const recurrentOptions = [
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
      .max(40, {
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
      .min(1, {
        message: "El monto debe ser mayor a 0",
      })
      .max(1_000_000_000, {
        message: "El monto debe ser menor a 1,000,000,000",
      }),
    dueDate: z
      .string()
      .refine(
        (value) => {
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        {
          message: "Debes seleccionar una fecha",
        }
      )
      .transform((value) => DateTime.fromJSDate(new Date(value)).toISODate())
      .optional(),
    recurrency: z.discriminatedUnion("recurrent", [
      z.object({
        recurrent: z.literal(true),
        data: z
          .object({
            frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"], {
              invalid_type_error:
                "Debes seleccionar una frecuencia de recurrencia",
              required_error: "Debes seleccionar una frecuencia de recurrencia",
            }),
            duration: z.number({
              coerce: true,
              invalid_type_error: "Debes seleccionar una duración",
              required_error: "Debes seleccionar una duración",
            }),
          })
          .superRefine((arg, ctx) => {
            if (arg.frequency === "WEEKLY") {
              if (arg.duration > MAX_WEEKLY_DURATION) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `WEEKLY - La duración debe ser menor a ${MAX_WEEKLY_DURATION}`,
                  path: ["recurrency", "duration"],
                });
              }
            }

            if (arg.frequency === "BIWEEKLY") {
              if (arg.duration > MAX_BIWEEKLY_DURATION) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `BIWEEKLY - La duración debe ser menor a ${MAX_BIWEEKLY_DURATION}`,
                  path: ["recurrency", "duration"],
                });
              }
            }

            if (arg.frequency === "MONTHLY") {
              if (arg.duration > MAX_MONTHLY_DURATION) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `MONTHLY - La duración debe ser menor a ${MAX_MONTHLY_DURATION}`,
                  path: ["recurrency", "duration"],
                });
              }
            }
          }),
      }),
      z.object({
        recurrent: z.literal(false),
        data: z.object({
          frequency: z.undefined(),
          duration: z.undefined(),
        }),
      }),
    ]),
  })
  .transform((value) => {
    return value.recurrency.recurrent
      ? { ...value, dueDate: undefined }
      : value;
  });
export type GeneralInfoInput = z.infer<typeof generalInfoInput>;

export const createDebtInput = z.object({
  generalInfo: generalInfoInput,
  borrowerEmails: z
    .array(z.string().email("Debes agregar un correo válido"))
    .min(1, {
      message: "Debes agregar al menos un correo",
    })
    .max(MAX_BORROWERS, {
      message: `No puedes agregar más de ${MAX_BORROWERS} correos`,
    })
    .refine((emails) => {
      const uniqueEmails = new Set(emails);
      return uniqueEmails.size === emails.length;
    }, "No puedes agregar correos duplicados"),
});

export type CreateDebtInput = z.infer<typeof createDebtInput>;
