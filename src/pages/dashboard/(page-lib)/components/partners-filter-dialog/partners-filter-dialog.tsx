import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { Button, buttonVariants } from "$/components/ui/button";
import { EyeIcon, Loader2, SearchCheckIcon, SearchIcon } from "lucide-react";
import { api } from "$/lib/utils/api";
import { Avatar } from "$/components/ui/avatar";
import { TimeInMs } from "$/lib/enums/time";
import { Label } from "$/components/ui/form/label";
import { Input } from "$/components/ui/form/input";
import { Separator } from "$/components/ui/separator";

type Props = {
  type: "borrower" | "lender";
  selectedPartnerEmail: string | null;
  selectPartnerEmail: (email: string | null) => void;
};

const PartnersFilterDialog: React.FC<Props> = ({
  type,
  selectPartnerEmail,
  selectedPartnerEmail,
}) => {
  const [filter, setFilter] = React.useState("");
  const query = api.debts.getUniquePartners.useQuery(
    {
      role: type,
    },
    {
      cacheTime: TimeInMs.OneMinute,
      staleTime: TimeInMs.OneMinute,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
  const partners = query.data ?? [];
  const filteredPartners = partners.filter((member) => {
    const searchTerm = filter.toLowerCase();
    const emailMatch =
      member.email?.toLowerCase().includes(searchTerm) ?? false;
    const nameMatch = member.name?.toLowerCase().includes(searchTerm) ?? false;
    return emailMatch || nameMatch;
  });

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant={selectedPartnerEmail ? "success" : "outline"}>
          {selectedPartnerEmail ? (
            <SearchCheckIcon className="h-4 w-4 sm:mr-2" />
          ) : (
            <SearchIcon className="h-4 w-4 sm:mr-2" />
          )}
          <span className="hidden sm:inline">
            Elegir {type === "borrower" ? "deudor" : "prestador"}
          </span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>
            Elegir {type === "borrower" ? "deudor" : "prestador"}
          </Dialog.Title>
        </Dialog.Header>

        <Label className="flex flex-col gap-1 text-sm">
          Buscar {type === "borrower" ? "deudor" : "prestador"}
          <Input
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            placeholder="Buscar..."
          />
        </Label>

        <Separator />

        <p className="text-sm text-muted-foreground">
          {type === "borrower" ? "Deudores" : "Prestadores"} con los que has
          compartido deudas
        </p>

        {query.isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <ul className="flex max-h-52 flex-col gap-2 overflow-y-auto">
            {filteredPartners.map((member) => (
              <li key={member.email}>
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-between text-sm"
                  onClick={() => {
                    if (selectedPartnerEmail === member.email) {
                      selectPartnerEmail(null);
                    } else {
                      selectPartnerEmail(member.email);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <Avatar.Image
                        src={member.image ?? undefined}
                        alt={member.email ?? undefined}
                      />
                      <Avatar.Fallback>
                        {member.email?.charAt(0) ?? "?"}
                      </Avatar.Fallback>
                    </Avatar>

                    <p className="break-all">
                      {member.name}{" "}
                      <span className="text-xs text-muted-foreground">
                        {member.email}
                      </span>
                    </p>
                  </div>

                  <span
                    className={buttonVariants({
                      variant:
                        selectedPartnerEmail === member.email
                          ? "destructive"
                          : "default",
                      size: "xs",
                      className: "flex items-center gap-1 rounded-sm",
                    })}
                  >
                    <EyeIcon className="h-4 w-4" />
                    {selectedPartnerEmail === member.email ? "Quitar" : "Ver"}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        )}

        <Dialog.Footer>
          <Dialog.Trigger asChild>
            <Button variant="secondary" className="w-full md:w-auto">
              Cerrar
            </Button>
          </Dialog.Trigger>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default PartnersFilterDialog;
