import React from "react";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import * as LucideIcons from "lucide-react";
import { Button } from "$/components/ui/button";
import { type LenderDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-owned-debts/input";
import { type BorrowerDebtsQueryInput } from "$/server/api/routers/debts/queries/handlers/get-shared-debts/input";

1;

type LenderProps = {
  sort: LenderDebtsQueryInput["sort"];
  setSort: React.Dispatch<React.SetStateAction<LenderDebtsQueryInput["sort"]>>;
};
type BorrowerProps = {
  sort: BorrowerDebtsQueryInput["sort"];
  setSort: React.Dispatch<
    React.SetStateAction<BorrowerDebtsQueryInput["sort"]>
  >;
};
type Props = LenderProps | BorrowerProps;

const SortMenu: React.FC<Props> = ({ sort, setSort }) => {
  const selectedSort = sort;
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">
          {selectedSort === "asc" ? (
            <LucideIcons.ArrowUp className="h-4 w-4 xs:mr-2" />
          ) : (
            <LucideIcons.ArrowDown className="h-4 w-4 xs:mr-2" />
          )}
          <span className="hidden xs:inline">Ordenar</span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="w-[150px]">
        <DropdownMenu.Label>Ordenar por Fecha</DropdownMenu.Label>
        <DropdownMenu.Separator />

        <DropdownMenu.CheckboxItem
          className="flex items-center gap-2"
          onClick={() => {
            setSort("asc");
          }}
          checked={selectedSort === "asc"}
        >
          Ascendente
        </DropdownMenu.CheckboxItem>

        <DropdownMenu.CheckboxItem
          className="flex items-center gap-2"
          onClick={() => {
            setSort("desc");
          }}
          checked={selectedSort === "desc"}
        >
          Descendente
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export default SortMenu;
