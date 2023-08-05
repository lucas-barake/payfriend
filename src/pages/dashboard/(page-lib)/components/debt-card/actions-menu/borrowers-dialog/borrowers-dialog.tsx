import React from "react";
import { Dialog } from "$/components/ui/dialog";
import { Button } from "$/components/ui/button";
import { api } from "$/lib/utils/api";
import { TimeInMs } from "$/lib/enums/time";
import { Avatar } from "$/components/ui/avatar";
import { Form } from "$/components/ui/form";
import { Popover } from "$/components/ui/popover";
import toast from "react-hot-toast";
import { handleMutationError } from "$/lib/utils/handle-mutation-error";
import { useForm } from "react-hook-form";
import {
  sendDebtInviteInput,
  type SendDebtInviteInput,
} from "$/server/api/routers/debts/mutations/handlers/invites/send-debt-invite/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Separator } from "$/components/ui/separator";
import * as LucideIcons from "lucide-react";
import PendingBorrowerRow from "$/pages/dashboard/(page-lib)/components/debt-card/actions-menu/borrowers-dialog/pending-borrower-row";
import { borrowerStatusLabels } from "$/lib/shared/borrower-status-labels";
import { Badge } from "$/components/ui/badge";
import RecentEmailsPopover from "$/pages/dashboard/(page-lib)/components/recent-emails-popover";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debtId: string;
};

const BorrowersDialog: React.FC<Props> = ({ open, onOpenChange, debtId }) => {
  const apiContext = api.useContext();
  const query = api.debts.getDebtBorrowersAndPendingBorrowers.useQuery(
    {
      debtId,
    },
    {
      enabled: open,
      staleTime: TimeInMs.TenSeconds,
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
      debtId,
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
        debtId,
      },
      (cachedData) => {
        if (cachedData) {
          return {
            ...cachedData,
            pendingBorrowers: [
              ...cachedData.pendingBorrowers,
              {
                inviteeEmail: input.email,
              },
            ],
          };
        }

        return cachedData;
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
                    debtId,
                  });
                }}
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
              />

              <Button
                size="sm"
                className="w-full text-sm sm:w-auto sm:text-base"
                type="submit"
                loading={sendInviteMutation.isLoading}
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

        {borrowers.map((borrower) => (
          <div
            className="my-2 flex items-center justify-between"
            key={borrower.id}
          >
            <div className="flex items-center gap-3">
              <Popover>
                <Popover.Trigger asChild>
                  <Button variant="outline" className="group relative">
                    <span className="sr-only">Ver información del deudor</span>
                    <LucideIcons.Eye className="absolute left-1/2 top-1/2 z-50 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform opacity-0 group-hover:opacity-100" />

                    <Avatar className="h-6 w-6 group-hover:opacity-0">
                      <Avatar.Image src={borrower.user.image ?? undefined} />

                      <Avatar.Fallback>
                        {borrower.user.name?.[0] ?? "?"}
                      </Avatar.Fallback>
                    </Avatar>
                  </Button>
                </Popover.Trigger>

                <Popover.Content className="flex flex-col gap-2" align="start">
                  <div className="flex items-center gap-1.5 text-sm text-foreground">
                    <span>{borrower.user.name ?? "Sin nombre"}</span>
                    <span className="truncate opacity-50">
                      {borrower.user.email}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">
                      Estado de pago:
                    </span>

                    <Badge
                      className="self-start text-sm"
                      variant={
                        borrower.status === "CONFIRMED"
                          ? "success"
                          : borrower.status === "PENDING_CONFIRMATION"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {borrowerStatusLabels.get(borrower.status)}
                    </Badge>
                  </div>
                </Popover.Content>
              </Popover>

              <span className="max-w-[150px] truncate text-foreground xs:max-w-[200px] sm:max-w-[250px]">
                {borrower.user.name ?? borrower.user.email}
              </span>
            </div>

            <Popover>
              <Popover.Trigger asChild>
                <Button size="sm" variant="destructive" className="opacity-50">
                  <LucideIcons.UserMinus className="h-5 w-5 sm:mr-1.5" />
                  <span className="sr-only sm:not-sr-only">Eliminar</span>
                </Button>
              </Popover.Trigger>

              <Popover.Content>
                <p className="text-sm text-foreground">
                  No puedes eliminar a un deudor que ya ha aceptado la
                  invitación.
                </p>
              </Popover.Content>
            </Popover>
          </div>
        ))}

        {pendingBorrowers.map((pendingBorrower) => (
          <PendingBorrowerRow
            key={pendingBorrower.inviteeEmail}
            pendingBorrower={pendingBorrower}
            debtId={debtId}
          />
        ))}

        <Dialog.Footer>
          <Dialog.Trigger asChild>
            <Button variant="tertiary" size="sm">
              Cerrar
            </Button>
          </Dialog.Trigger>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default BorrowersDialog;
