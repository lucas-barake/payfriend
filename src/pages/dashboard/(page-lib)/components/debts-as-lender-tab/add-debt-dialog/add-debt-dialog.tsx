import React from "react";
import { Button } from "$/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog } from "$/components/ui/dialog";
import GeneralInfoForm from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/add-debt-dialog/general-info-form";
import BorrowersForm from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/add-debt-dialog/members-form";
import { useTabs } from "$/hooks/use-tabs/use-tabs";
import {
  type AddDebtTab,
  addDebtTabs,
} from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/add-debt-dialog/(component-lib)/add-debt-tabs";
import { Tabs } from "$/components/ui/tabs";
import {
  type CreateDebtInput,
  defaultCreateDebtInput,
} from "$/server/api/routers/debts/create-debt/input";
import { SubscriptionsDialog } from "$/components/common/subscriptions-dialog";
import { useFreePlanLimit } from "$/hooks/use-free-plan-limit";
import { type DebtsAsLenderInput } from "$/server/api/routers/debts/get-debts/debts-as-lender/input";

type Props = {
  queryVariables: DebtsAsLenderInput;
};

const AddDebtDialog: React.FC<Props> = ({ queryVariables }) => {
  const [formData, setFormData] = React.useState<CreateDebtInput>(
    defaultCreateDebtInput
  );
  const [open, setOpen] = React.useState(false);
  const [openSubscriptionsDialog, setOpenSubscriptionsDialog] =
    React.useState(false);
  const [selectedTab, tabSetters] = useTabs(addDebtTabs);
  const freePlanLimit = useFreePlanLimit();

  return (
    <>
      <SubscriptionsDialog
        open={openSubscriptionsDialog}
        onOpenChange={setOpenSubscriptionsDialog}
        reachedFreeLimit
      />

      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) {
            tabSetters.reset();
          }
        }}
      >
        <Button
          className="flex items-center gap-1"
          onClick={() => {
            if (freePlanLimit.reachedMonthlyLimit) {
              setOpenSubscriptionsDialog(true);
              return;
            }
            setOpen(true);
            tabSetters.set(addDebtTabs[0]);
          }}
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline-flex">Agregar</span>
          Deuda
        </Button>

        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>
              {selectedTab === "general-info-form"
                ? "Agregar Deuda"
                : "Invitar Deudores"}
            </Dialog.Title>

            <Dialog.Description>
              {selectedTab === "general-info-form" ? (
                <>
                  ⚠️ Una vez hayas creada la deuda, no podrás cambiar esta
                  información.
                </>
              ) : (
                <>
                  ⚠️ Podrás agregar más deudores luego de crear la deuda, pero
                  no podrás eliminar a los deudores una vez hayan aceptado la
                  invitación.
                </>
              )}
            </Dialog.Description>
          </Dialog.Header>

          <Tabs
            value={selectedTab}
            onValueChange={(v) => {
              tabSetters.set(v as AddDebtTab);
            }}
          >
            <Tabs.Content value={addDebtTabs[0]}>
              <GeneralInfoForm
                tabSetters={tabSetters}
                formData={formData}
                setFormData={setFormData}
              />
            </Tabs.Content>

            <Tabs.Content value={addDebtTabs[1]}>
              <BorrowersForm
                tabSetters={tabSetters}
                setOpen={setOpen}
                queryVariables={queryVariables}
                formData={formData}
                setFormData={setFormData}
              />
            </Tabs.Content>
          </Tabs>
        </Dialog.Content>
      </Dialog>
    </>
  );
};

export default AddDebtDialog;
