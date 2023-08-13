import React from "react";
import { cn } from "$/lib/utils/cn";
import { Avatar } from "$/components/ui/avatar";
import { Badge } from "$/components/ui/badge";
import {
  BadgeCheck,
  CalendarCheck,
  CalendarIcon,
  Clock,
  RotateCw,
} from "lucide-react";
import { DateTime } from "luxon";
import { getRecurrentDebtFinalPayment } from "$/pages/dashboard/(page-lib)/utils/get-recurrent-debt-final-payment";
import { DebtRecurringFrequency } from "@prisma/client";
import { Skeleton } from "$/components/ui/skeleton";
import { getRecurrentCycleDates } from "$/pages/dashboard/(page-lib)/utils/get-recurrent-cycle-dates";
import { formatCurrency } from "$/lib/utils/format-currency";
import { type Currency } from "$/server/api/routers/debts/create-debt/input";

type RootProps = {
  children: React.ReactNode;
  isConcluded: boolean;
} & React.ComponentPropsWithoutRef<"div">;
const Root: React.FC<RootProps> = ({
  children,
  className,
  isConcluded,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 rounded-lg border border-border p-6 shadow-sm",
        className,
        isConcluded && "group opacity-50 hover:opacity-100"
      )}
      {...props}
    >
      {isConcluded && (
        <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center rounded-lg group-hover:hidden">
          <div className="flex h-full items-center justify-center">
            <BadgeCheck className="h-12 w-12 text-foreground" />
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

type HeaderProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">;
const Header: React.FC<HeaderProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type TitleProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"span">;
const Title: React.FC<TitleProps> = ({ children, className, ...props }) => {
  return (
    <span
      className={cn("max-w-[250px] text-lg font-bold", className)}
      {...props}
    >
      {children}
    </span>
  );
};

type AvatarContainerProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">;
const AvatarContainer: React.FC<AvatarContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("flex -space-x-2 overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
};

type AvatarProps = {
  image: string | null | undefined;
  fallback: string;
  className?: string;
};
const MemberAvatar: React.FC<AvatarProps> = ({
  image,
  fallback,
  className,
}) => {
  return (
    <Avatar className={cn("h-7 w-7", className)}>
      <Avatar.Image src={image ?? undefined} />

      <Avatar.Fallback>{fallback}</Avatar.Fallback>
    </Avatar>
  );
};

type BadgeContainerProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">;
const BadgeContainer: React.FC<BadgeContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start gap-1.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type AmountBadgeProps = {
  amount: number;
  currency: Currency;
} & React.ComponentPropsWithoutRef<typeof Badge>;
const AmountBadge: React.FC<AmountBadgeProps> = ({
  amount,
  currency,
  ...props
}) => {
  console.log({ amount, currency });
  return (
    <Badge variant="success" {...props}>
      {formatCurrency(amount, currency)}
    </Badge>
  );
};

type DueDateBadgeProps = {
  recurringFrequency: DebtRecurringFrequency | null;
  duration: number | null;
  createdAt: Date | null;
  dueDate: Date | null;
} & React.ComponentPropsWithoutRef<typeof Badge>;
const DueDateBadge: React.FC<DueDateBadgeProps> = ({
  className,
  recurringFrequency,
  duration,
  createdAt,
  dueDate,
  ...props
}) => {
  const isRecurrent =
    recurringFrequency !== null && duration !== null && createdAt !== null;
  if (!isRecurrent && dueDate === null) return null;

  const finalPaymentDate = isRecurrent
    ? getRecurrentDebtFinalPayment({
        recurringFrequency,
        duration,
        createdAt,
      })
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We know it's not null because of the previous condition
      DateTime.fromJSDate(dueDate!);
  const endsToday = finalPaymentDate.hasSame(DateTime.now(), "day");
  const hasEnded = finalPaymentDate < DateTime.now();

  return (
    <Badge
      variant={endsToday ? "destructive" : "outline"}
      className={cn("self-start", className)}
      {...props}
    >
      <CalendarCheck className="mr-1.5 h-3.5 w-3.5" />
      {endsToday ? "Finaliza hoy" : hasEnded ? "Finalizó" : "Finaliza"}{" "}
      {!endsToday && finalPaymentDate.toLocaleString(DateTime.DATE_MED)}
    </Badge>
  );
};

export const recurringFrequencyLabels = new Map<DebtRecurringFrequency, string>(
  [
    [DebtRecurringFrequency.WEEKLY, "Semanal"],
    [DebtRecurringFrequency.BIWEEKLY, "Quincenal"],
    [DebtRecurringFrequency.MONTHLY, "Mensual"],
  ]
);
type RecurringBadgeProps = {
  recurringFrequency: DebtRecurringFrequency | null;
  duration: number | null;
  className?: string;
};
const RecurringFrequencyBadge: React.FC<RecurringBadgeProps> = ({
  recurringFrequency,
  duration,
  className,
}) => {
  const isRecurrent = recurringFrequency !== null && duration !== null;
  if (!isRecurrent) return null;

  return (
    <Badge variant="outline" className={cn(className)}>
      <RotateCw className="mr-1.5 h-3.5 w-3.5" />
      {recurringFrequencyLabels.get(recurringFrequency)!} ({duration})
    </Badge>
  );
};

type PayUntilRecurrenceBadgeProps = {
  recurringFrequency: DebtRecurringFrequency | null;
  duration: number | null;
  createdAt: Date;
};
const PayUntilRecurrenceBadge: React.FC<PayUntilRecurrenceBadgeProps> = ({
  recurringFrequency,
  duration,
  createdAt,
}) => {
  const isRecurrent = recurringFrequency !== null && duration !== null;
  if (!isRecurrent) return null;

  const cycles: DateTime[] = getRecurrentCycleDates({
    recurringFrequency,
    duration,
    createdAt,
  });
  const currentCycle = cycles.find((cycle) => cycle > DateTime.now());
  if (!currentCycle) return null;

  return (
    <Badge variant="outline">
      <Clock className="mr-1.5 h-3.5 w-3.5" />
      Paga antes del {currentCycle.toLocaleString(DateTime.DATE_MED)}
    </Badge>
  );
};

type DescriptionProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"p">;
const Description: React.FC<DescriptionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p className={cn("mb-6 mt-2 pr-2 lg:pr-3 xl:pr-6", className)} {...props}>
      {children}
    </p>
  );
};

type FooterProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">;
const Footer: React.FC<FooterProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "mt-auto flex w-full items-center justify-between gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type CreatedAtBadgeProps = {
  createdAt: Date;
} & React.ComponentPropsWithoutRef<typeof Badge>;
const CreatedAtBadge: React.FC<CreatedAtBadgeProps> = ({
  className,
  createdAt,
  ...props
}) => {
  return (
    <Badge
      variant="outline"
      className={cn("h-full break-all", className)}
      {...props}
    >
      <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
      <span>
        Creada{" "}
        {DateTime.fromJSDate(createdAt).toLocaleString(DateTime.DATE_MED)}
      </span>
    </Badge>
  );
};
const DebtCardSkeleton: React.FC = () => (
  <Skeleton className="flex h-48 flex-col gap-2 rounded-lg p-6" />
);

const DebtCard = Object.assign(Root, {
  Header,
  Title,
  AvatarContainer,
  MemberAvatar,
  BadgeContainer,
  AmountBadge,
  DueDateBadge,
  RecurringFrequencyBadge,
  PayUntilRecurrenceBadge,
  Description,
  Footer,
  CreatedAtBadge,
  Skeleton: DebtCardSkeleton,
});

export default DebtCard;
