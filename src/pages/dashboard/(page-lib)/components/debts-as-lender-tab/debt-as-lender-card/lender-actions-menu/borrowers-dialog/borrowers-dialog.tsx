import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { Button } from "$/components/ui/button";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import { Form } from "$/components/ui/form";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";
import { useForm } from "react-hook-form";
import {
  sendDebtInviteInput,
  type SendDebtInviteInput,
} from "$/server/api/routers/debts/invites/send-debt-invite/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Separator } from "$/components/ui/separator";
import * as LucideIcons from "lucide-react";
import PendingBorrowerRow from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/borrowers-dialog/pending-borrower-row";
import RecentEmailsPopover from "$/pages/dashboard/(page-lib)/components/recent-emails-popover";
import BorrowerRow from "$/pages/dashboard/(page-lib)/components/debts-as-lender-tab/debt-as-lender-card/lender-actions-menu/borrowers-dialog/borrower-row";
import { type GetDebtBorrowersAndPendingBorrowersResult } from "$/server/api/routers/debts/get-debts/get-debt-borrowers-and-pending-borrowers/types";
import { Loader } from "$/components/ui/loader";
import { type DebtsAsLenderResult } from "$/server/api/routers/debts/get-debts/debts-as-lender/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debt: DebtsAsLenderResult["debts"][number];
};

const BorrowersDialog: React.FC<Props> = ({ open, onOpenChange, debt }) => {
  const isArchived = debt.archived !== null;
  const apiContext = api.useContext();
  const query = api.debts.getDebtBorrowersAndPendingBorrowers.useQuery(
    {
      debtId: debt.id,
    },
    {
      enabled: open,
      staleTime: TimeInMs.TenSeconds,
      cacheTime: TimeInMs.TenSeconds,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );
  const borrowers = query.data?.borrowers ?? [];
  const pendingBorrowers = query.data?.pendingBorrowers ?? [];
  // @ts-expect-error - TypeScript can't infer filter removes nulls
  const allEmails: string[] = borrowers
    .filter((b) => b.user.email !== null)
    .map((b) => b.user.email)
    .concat(pendingBorrowers.map((b) => b.inviteeEmail));

  const session = useSession();
  const sendInviteForm = useForm<SendDebtInviteInput>({
    defaultValues: {
      debtId: debt.id,
    },
    resolver: zodResolver(
      sendDebtInviteInput
        .refine((data) => data.email !== session.data?.user?.email, {
          message: "No puedes invitarte a ti mismo",
          path: ["email"],
        })
        .refine((data) => !borrowers.some((b) => b.user.email === data.email), {
          message: "Ya existe un deudor con ese correo electrónico",
          path: ["email"],
        })
        .refine(
          (data) =>
            !pendingBorrowers.some((b) => b.inviteeEmail === data.email),
          {
            message:
              "Ya existe una invitación pendiente con ese correo electrónico",
            path: ["email"],
          }
        )
    ),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const sendInviteMutation = api.debts.sendDebtInvite.useMutation();

  async function handleSendInvite(input: SendDebtInviteInput): Promise<void> {
    await toast.promise(sendInviteMutation.mutateAsync(input), {
      loading: "Enviando invitación...",
      success: "Invitación enviada",
      error: handleMutationError,
    });

    apiContext.debts.getDebtBorrowersAndPendingBorrowers.setData(
      {
        debtId: debt.id,
      },
      (cachedData) => {
        if (cachedData === undefined) return cachedData;
        return {
          ...cachedData,
          pendingBorrowers: [
            ...cachedData.pendingBorrowers,
            {
              inviteeEmail: input.email,
            },
          ],
        } satisfies GetDebtBorrowersAndPendingBorrowersResult;
      }
    );

    sendInviteForm.reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        sendInviteForm.reset();
      }}
    >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Deudores</Dialog.Title>
        </Dialog.Header>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Form onSubmit={sendInviteForm.handleSubmit(handleSendInvite)}>
          <Form.Group>
            <div className="flex items-center justify-between gap-3 sm:justify-start">
              <Form.Label htmlFor="email">Invitar a un deudor</Form.Label>

              <RecentEmailsPopover
                currentEmails={allEmails}
                onSelect={(email) => {
                  void handleSendInvite({
                    email,
                    debtId: debt.id,
                  });
                }}
                disabled={isArchived}
                disableSelected
              />
            </div>

            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <Form.Input
                type="email"
                placeholder="Correo electrónico"
                autoComplete="off"
                id="email"
                {...sendInviteForm.register("email")}
                error={
                  sendInviteForm.formState.errors.email?.message !== undefined
                }
                disabled={isArchived}
              />

              <Button
                size="sm"
                className="w-full text-sm sm:w-auto sm:text-base"
                type="submit"
                loading={sendInviteMutation.isLoading}
                disabled={isArchived}
              >
                {!sendInviteMutation.isLoading && (
                  <LucideIcons.LucideMail className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                )}
                Invitar
              </Button>
            </div>

            <Form.FieldError>
              {sendInviteForm.formState.errors.email?.message}
            </Form.FieldError>
          </Form.Group>
        </Form>

        <Separator />

        {query.isFetching ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <>
            {borrowers.map((borrower) => (
              <BorrowerRow borrower={borrower} key={borrower.user.id} />
            ))}

            {!isArchived &&
              pendingBorrowers.map((pendingBorrower) => (
                <PendingBorrowerRow
                  key={pendingBorrower.inviteeEmail}
                  pendingBorrower={pendingBorrower}
                  debtId={debt.id}
                />
              ))}
          </>
        )}

        <Dialog.Footer>
          <Dialog.Trigger asChild>
            <Button variant="secondary" size="sm">
              Cerrar
            </Button>
          </Dialog.Trigger>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default BorrowersDialog;
