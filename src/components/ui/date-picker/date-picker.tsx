import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "$/lib/utils/cn";
import { Button } from "$/components/ui/button";
import { Calendar, type CalendarProps } from "$/components/ui/calendar";
import { Popover } from "$/components/ui/popover";
import { DateTime } from "luxon";

type Props = {
  value: string | undefined;
  onChange: (date: Date | undefined) => void;
} & CalendarProps;

export const DatePicker: React.FC<Props> = ({ value, onChange, ...props }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            DateTime.fromJSDate(new Date(value)).toLocaleString(
              DateTime.DATE_FULL
            )
          ) : (
            <span>Escoge una fecha</span>
          )}
        </Button>
      </Popover.Trigger>

      <Popover.Content className="w-auto p-0">
        <Calendar
          {...props}
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          initialFocus
        />
      </Popover.Content>
    </Popover>
  );
};
