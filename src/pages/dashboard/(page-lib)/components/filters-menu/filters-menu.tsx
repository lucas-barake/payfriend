import React from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "$/components/ui/button";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import {
  type DebtsAsLenderInput,
  statusOptions,
} from "$/server/api/routers/debts/queries/handlers/debts-as-lender/input";
import {
  type DebtsAsBorrowerInput,
  borrowerStatusOptions,
} from "$/server/api/routers/debts/queries/handlers/debts-as-borrower/input";

type LenderProps = {
  selectedStatus: DebtsAsLenderInput["status"];
  setSelectedStatus: (status: DebtsAsLenderInput["status"]) => void;
  lender: true;
};
type BorrowerProps = {
  selectedStatus: DebtsAsBorrowerInput["status"];
  setSelectedStatus: (status: DebtsAsBorrowerInput["status"]) => void;
  lender: false;
};
type Props = LenderProps | BorrowerProps;

const FiltersMenu: React.FC<Props> = ({
  selectedStatus,
  setSelectedStatus,
  lender,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">
          <LucideIcons.Settings2 className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">
            {
              statusOptions.find((status) => status.value === selectedStatus)
                ?.label
            }
          </span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" className="w-[185px]">
        <DropdownMenu.Label>Filtrar por Estado</DropdownMenu.Label>
        <DropdownMenu.Separator />

        {lender
          ? statusOptions.map((status) => (
              <DropdownMenu.CheckboxItem
                key={status.value}
                onClick={() => {
                  setSelectedStatus(status.value);
                }}
                checked={status.value === selectedStatus}
                className="flex items-center gap-2"
              >
                {status.label}
              </DropdownMenu.CheckboxItem>
            ))
          : borrowerStatusOptions.map((status) => (
              <DropdownMenu.CheckboxItem
                key={status.value}
                onClick={() => {
                  setSelectedStatus(status.value);
                }}
                checked={status.value === selectedStatus}
                className="flex items-center gap-2"
              >
                {status.label}
              </DropdownMenu.CheckboxItem>
            ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export default FiltersMenu;
