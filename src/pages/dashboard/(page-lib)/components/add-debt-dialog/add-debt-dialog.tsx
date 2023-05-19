import React from "react";
import { Button } from "$/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog } from "$/components/ui/dialog";
import GeneralInfoForm from "$/pages/dashboard/(page-lib)/components/add-debt-dialog/general-info-form";
import MembersForm from "$/pages/dashboard/(page-lib)/components/add-debt-dialog/members-form";
import { useTabs } from "$/hooks/use-tabs/use-tabs";
import {
  type AddDebtTab,
  addDebtTabs,
} from "$/pages/dashboard/(page-lib)/components/add-debt-dialog/(component-lib)/add-debt-tabs";
import { Tabs } from "$/components/ui/tabs";
import { FormProvider, useForm } from "react-hook-form";
import { type CreateGroupInput } from "$/server/api/routers/debts/mutations/input";

const AddDebtDialog: React.FC = () => {
  const [selectedTab, tabSetters] = useTabs(addDebtTabs);
  const form = useForm<CreateGroupInput>({
    defaultValues: {
      borrowerEmails: [],
    },
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          tabSetters.reset();
        }
      }}
    >
      <Dialog.Trigger asChild>
        <Button size="sm" className="text-sm">
          <Plus className="mr-1 h-5 w-5 sm:mr-2" />
          <span className="mr-1 hidden xs:inline-flex">Agregar</span>
          Deuda
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>
            {selectedTab === "general-info-form"
              ? "Agregar Deuda"
              : "Agregar Deudores"}
          </Dialog.Title>
        </Dialog.Header>

        <Tabs
          value={selectedTab}
          onValueChange={(v) => {
            tabSetters.set(v as AddDebtTab);
          }}
        >
          <FormProvider {...form}>
            <Tabs.Content value={addDebtTabs[0]}>
              <GeneralInfoForm tabSetters={tabSetters} />
            </Tabs.Content>

            <Tabs.Content value={addDebtTabs[1]}>
              <MembersForm tabSetters={tabSetters} />
            </Tabs.Content>
          </FormProvider>
        </Tabs>
      </Dialog.Content>
    </Dialog>
  );
};

export default AddDebtDialog;
