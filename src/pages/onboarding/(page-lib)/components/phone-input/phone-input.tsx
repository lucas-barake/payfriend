import React from "react";
import { View } from "$/pages/onboarding/(page-lib)/enums/view";
import { api } from "$/lib/utils/api";
import { Button } from "$/components/ui/button";
import { Popover } from "$/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command } from "$/components/ui/command";
import { countriesWithCodes } from "$/pages/onboarding/(page-lib)/lib/countries-with-codes";
import { cn } from "$/lib/utils/cn";
import { Form } from "$/components/ui/form";
import { Virtuoso } from "react-virtuoso";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsYouType } from "libphonenumber-js";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { strTransformer } from "$/lib/utils/str-transformer";
import {
  sendPhoneOtpInput,
  type SendPhoneOtpInput,
} from "$/server/api/routers/user/phone/otp/send-phone-otp/input";
import { FieldError } from "$/components/ui/form/field-error";
import { TRPCError } from "@trpc/server";
import { type VerifyPhoneInput } from "$/server/api/routers/user/phone/otp/verify-phone/input";

type Props = {
  setView: React.Dispatch<React.SetStateAction<View>>;
  setPhone: (phone: VerifyPhoneInput["phone"]) => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const initCountry = countriesWithCodes.find((c) => c.name_es === "Colombia")!;

const PhoneInput: React.FC<Props> = ({ setView, setPhone }) => {
  const [openCombobox, setOpenCombobox] = React.useState(false);

  const [selectedCountry, setSelectedCountry] =
    React.useState<typeof countriesWithCodes[number]>(initCountry);
  const [countryQuery, setCountryQuery] = React.useState<string>();
  const filteredCountries = React.useMemo(
    () =>
      countriesWithCodes.filter((c) => {
        return countryQuery === undefined
          ? true
          : strTransformer
              .normalize(c.name_es)
              .includes(strTransformer.normalize(countryQuery));
      }),
    [countryQuery]
  );

  const form = useForm<SendPhoneOtpInput>({
    defaultValues: {
      phone: {
        phoneNumber: "",
        countryCode: initCountry.code_2,
      },
    },
    resolver: zodResolver(sendPhoneOtpInput),
    mode: "onSubmit",
  });

  const sendCodeMutation = api.user.sendPhoneOtp.useMutation();

  async function sendCode(input: SendPhoneOtpInput): Promise<void> {
    try {
      await toast.promise(sendCodeMutation.mutateAsync(input), {
        loading: "Enviando código...",
        success: "Código enviado",
        error: handleToastError,
      });

      setPhone(input.phone);
      setView(View.OTP_INPUT);
    } catch (error) {
      if (error instanceof TRPCError) {
        if (error.code === "TOO_MANY_REQUESTS") {
          setView(View.OTP_INPUT);
          return;
        }
      }
      handleToastError(error);
    }
  }

  return (
    <>
      <p className="text-center">
        Para verificar tu inicio de sesión, ingresa tu número de celular a
        continuación. Te enviaremos un código de un solo uso para que lo
        ingreses.
      </p>

      <Form
        className="mt-2 flex w-full max-w-sm flex-col items-center justify-center"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(sendCode)}
      >
        <div className="flex w-full items-center gap-1">
          <Popover
            open={openCombobox}
            onOpenChange={(): void => {
              setOpenCombobox(!openCombobox);
            }}
          >
            <Popover.Trigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={true}
                className="w-[125px] justify-between px-2.5"
                title="Seleccionar país"
              >
                {selectedCountry.emoji} {selectedCountry.dial_code}
                <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </Popover.Trigger>

            <Popover.Content className="w-[300px] p-0">
              <Command
                shouldFilter={false}
                // @ts-expect-error - Wrong type from cmdk
                defaultValue={selectedCountry}
              >
                <Command.Input
                  placeholder="Buscar país"
                  value={countryQuery}
                  onValueChange={setCountryQuery}
                />

                <Command.Empty>
                  No hay resultados para esta búsqueda
                </Command.Empty>

                <Command.Group>
                  <Virtuoso
                    data={filteredCountries}
                    style={{ height: "300px", width: "100%" }}
                    itemContent={(_, item) => {
                      return (
                        <Command.Item
                          key={item.dial_code}
                          onSelect={(): void => {
                            setSelectedCountry(item);
                            setOpenCombobox(false);
                            form.setValue("phone.countryCode", item.code_2);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCountry === item
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.emoji} {item.name_es} ({item.dial_code})
                        </Command.Item>
                      );
                    }}
                  />
                </Command.Group>
              </Command>
            </Popover.Content>
          </Popover>

          <Form.Label htmlFor="phone.phoneNumber" className="sr-only">
            Número de celular
          </Form.Label>
          <Controller
            name="phone.phoneNumber"
            control={form.control}
            render={({ field }) => {
              return (
                <Form.Input
                  id="phone.phoneNumber"
                  placeholder={selectedCountry.placeholder}
                  value={field.value}
                  onChange={(e) => {
                    let newValue = e.target.value;
                    const newFormattedValue = new AsYouType(
                      selectedCountry.code_2
                    ).input(newValue);
                    if (
                      newValue.length < field.value.length &&
                      newFormattedValue === field.value
                    ) {
                      newValue = newValue.slice(0, -1);
                    }
                    field.onChange(
                      new AsYouType(selectedCountry.code_2).input(newValue)
                    );
                  }}
                  type="tel"
                  error={form.formState.errors.phone !== undefined}
                />
              );
            }}
          />
        </div>

        <FieldError>{form.formState.errors.phone?.message}</FieldError>

        <Button
          type="submit"
          variant="tertiary"
          className="mt-8 flex w-full gap-2 self-center"
          loading={sendCodeMutation.isLoading}
        >
          Continuar
        </Button>
      </Form>
    </>
  );
};

export default PhoneInput;
