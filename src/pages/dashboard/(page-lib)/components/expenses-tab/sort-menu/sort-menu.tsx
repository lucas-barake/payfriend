import React from "react";
import { type GetPersonalExpensesInput } from "$/server/api/routers/personal-expenses/queries/input";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { Button } from "$/components/ui/button";
import * as LucideIcons from "lucide-react";

type Props = {
  state: GetPersonalExpensesInput;
  setState: React.Dispatch<React.SetStateAction<GetPersonalExpensesInput>>;
};

const SortMenu: React.FC<Props> = ({ state, setState }) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">
          {state.orderBy.createdAt === "desc" ? (
            <LucideIcons.ArrowDown className="h-4 w-4 sm:mr-2" />
          ) : (
            <LucideIcons.ArrowUp className="h-4 w-4 sm:mr-2" />
          )}
          <span className="hidden sm:inline">Ordenar</span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="w-[200px]" align="end">
        <DropdownMenu.Label>Ordenar Por Fecha</DropdownMenu.Label>

        <DropdownMenu.CheckboxItem
          className="flex cursor-pointer items-center gap-2"
          checked={state.orderBy.createdAt === "asc"}
          onClick={() => {
            setState((prevState) => ({
              ...prevState,
              orderBy: {
                amount: null,
                createdAt: "asc",
              },
              skip: 0,
            }));
          }}
        >
          Ascendente
        </DropdownMenu.CheckboxItem>

        <DropdownMenu.CheckboxItem
          className="flex cursor-pointer items-center gap-2"
          checked={state.orderBy.createdAt === "desc"}
          onClick={() => {
            setState((prevState) => ({
              ...prevState,
              orderBy: {
                amount: null,
                createdAt: "desc",
              },
              skip: 0,
            }));
          }}
        >
          Descendente
        </DropdownMenu.CheckboxItem>

        <DropdownMenu.Separator />

        <DropdownMenu.Label>Ordenar Por Cantidad</DropdownMenu.Label>
        <DropdownMenu.CheckboxItem
          className="flex cursor-pointer items-center gap-2"
          onClick={() => {
            setState((prevState) => ({
              ...prevState,
              orderBy: {
                amount: "asc",
                createdAt: null,
              },
              skip: 0,
            }));
          }}
          checked={state.orderBy.amount === "asc"}
        >
          Ascendente
        </DropdownMenu.CheckboxItem>

        <DropdownMenu.CheckboxItem
          className="flex cursor-pointer items-center gap-2"
          onClick={() => {
            setState((prevState) => ({
              ...prevState,
              orderBy: {
                amount: "desc",
                createdAt: null,
              },
              skip: 0,
            }));
          }}
          checked={state.orderBy.amount === "desc"}
        >
          Descendente
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export default SortMenu;
