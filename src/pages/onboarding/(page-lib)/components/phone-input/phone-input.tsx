import React from "react";
import { View } from "$/pages/onboarding/(page-lib)/enums/view";
import { api } from "$/lib/utils/api";
import toast from "react-hot-toast";
import { handleToastError } from "$/components/ui/styled-toaster";
import { Button } from "$/components/ui/button";
import { Popover } from "$/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command } from "$/components/ui/command";
import { countriesWithCodes } from "$/pages/onboarding/(page-lib)/lib/countries-with-codes";
import cn from "$/lib/utils/cn";
import { Form } from "$/components/ui/form";
import { Virtuoso } from "react-virtuoso";

type Props = {
  setView: React.Dispatch<React.SetStateAction<View>>;
};

const PhoneInput: React.FC<Props> = ({ setView }) => {
  const [openCombobox, setOpenCombobox] = React.useState(false);

  const [selectedCountry, setSelectedCountry] = React.useState<
    typeof countriesWithCodes[number]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  >(countriesWithCodes.find((c) => c.name_es === "Colombia")!);
  const [countryQuery, setCountryQuery] = React.useState<string>();
  const filteredCountries = React.useMemo(
    () =>
      countriesWithCodes.filter((c) => {
        return countryQuery === undefined
          ? true
          : c.name_es.toLowerCase().includes(countryQuery.toLowerCase());
      }),
    [countryQuery]
  );

  const sendOTPMutation = api.user.sendPhoneOTP.useMutation();
  async function _sendOTP(): Promise<void> {
    await toast.promise(sendOTPMutation.mutateAsync(), {
      loading: "Enviando código...",
      success: "Código enviado",
      error: handleToastError,
    });
  }

  return (
    <>
      <p className="text-center">
        Para verificar tu inicio de sesión, ingresa tu número de celular a
        continuación. Te enviaremos un código de un solo uso para que lo
        ingreses.
      </p>

      <div className="mt-2 flex w-full max-w-sm flex-col items-center justify-center gap-8">
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

          <Form.Input
            label="Número de celular"
            srOnly
            type="tel"
            placeholder="Número de celular"
            labelClassName="flex-1"
          />
        </div>

        <Button
          variant="tertiary"
          className="flex w-full gap-2 self-center"
          loading={sendOTPMutation.isLoading}
          onClick={() => {
            setView(View.OTP_INPUT);
          }}
        >
          Continuar
        </Button>
      </div>
    </>
  );
};

export default PhoneInput;
