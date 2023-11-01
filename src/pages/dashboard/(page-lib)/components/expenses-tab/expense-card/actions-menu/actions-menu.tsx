import React from "react";
import { DropdownMenu } from "$/components/ui/dropdown-menu";
import { Button } from "$/components/ui/button";
import { EditIcon, SettingsIcon, TrashIcon } from "lucide-react";
import AddEditExpenseDialog from "$/pages/dashboard/(page-lib)/components/expenses-tab/add-edit-expense-dialog/add-edit-expense-dialog";
import { type GetPersonalExpensesResult } from "$/server/api/routers/personal-expenses/queries/types";
import DeleteExpenseDialog from "src/pages/dashboard/(page-lib)/components/expenses-tab/expense-card/actions-menu/delete-expense-dialog";

type Props = {
  expense: GetPersonalExpensesResult["expenses"][number];
};

const ActionsMenu: React.FC<Props> = ({ expense }) => {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  return (
    <React.Fragment>
      <AddEditExpenseDialog
        open={openEdit}
        setOpen={setOpenEdit}
        editingExpense={expense}
      />

      <DeleteExpenseDialog
        expense={expense}
        open={openDelete}
        setOpen={setOpenDelete}
      />

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">
            <SettingsIcon className="h-4 w-4" />
            <span className="sr-only">Acciones</span>
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.Label>Acciones</DropdownMenu.Label>

          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2"
            onClick={() => {
              setOpenEdit(true);
            }}
          >
            <EditIcon className="h-4 w-4" />
            Editar
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2"
            destructive
            onClick={() => {
              setOpenDelete(true);
            }}
          >
            <TrashIcon className="h-4 w-4" />
            Eliminar
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </React.Fragment>
  );
};

export default ActionsMenu;
