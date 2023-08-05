import React from "react";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import * as LucideIcons from "lucide-react";
import { Button } from "$/components/ui/button";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

type Props = {
  selectedSort: SortOrder;
  setSelectedSort: (sort: SortOrder) => void;
};

const SortMenu: React.FC<Props> = ({ setSelectedSort, selectedSort }) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">
          {selectedSort === "asc" ? (
            <LucideIcons.ArrowUp className="h-4 w-4 sm:mr-2" />
          ) : (
            <LucideIcons.ArrowDown className="h-4 w-4 sm:mr-2" />
          )}
          <span className="hidden sm:inline">Ordenar</span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="w-[150px]">
        <DropdownMenu.Label>Ordenar por Fecha</DropdownMenu.Label>
        <DropdownMenu.Separator />

        <DropdownMenu.CheckboxItem
          className="flex items-center gap-2"
          onClick={() => {
            setSelectedSort("asc");
          }}
          checked={selectedSort === "asc"}
        >
          Ascendente
        </DropdownMenu.CheckboxItem>

        <DropdownMenu.CheckboxItem
          className="flex items-center gap-2"
          onClick={() => {
            setSelectedSort("desc");
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
