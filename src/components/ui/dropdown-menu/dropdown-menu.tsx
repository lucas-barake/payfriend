import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import cn from "$/utils/cn";

type DropdownMenuSubTriggerDefinition = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
      inset?: boolean;
    }
  > &
    React.RefAttributes<
      React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>
    >
>;
const DropdownMenuSubTrigger: DropdownMenuSubTriggerDefinition =
  React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
      inset?: boolean;
    }
  >(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  ));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

type DropdownMenuSubContentDefinition = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
  > &
    React.RefAttributes<
      React.ElementRef<typeof DropdownMenuPrimitive.SubContent>
    >
>;
const DropdownMenuSubContent: DropdownMenuSubContentDefinition =
  React.forwardRef(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "text-on-popover z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
        className
      )}
      {...props}
    />
  ));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

type DropdownMenuContentDefinition = React.ForwardRefExoticComponent<
  Omit<
    DropdownMenuPrimitive.DropdownMenuContentProps &
      React.RefAttributes<HTMLDivElement>,
    "ref"
  > &
    React.RefAttributes<HTMLDivElement>
>;
const DropdownMenuContent: DropdownMenuContentDefinition = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

type DropdownMenuItemDefinition = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
      inset?: boolean;
    }
  > &
    React.RefAttributes<React.ElementRef<typeof DropdownMenuPrimitive.Item>>
>;
const DropdownMenuItem: DropdownMenuItemDefinition = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

type DropdownMenuCheckboxItemDefinition = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
  > &
    React.RefAttributes<
      React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>
    >
>;
const DropdownMenuCheckboxItem: DropdownMenuCheckboxItemDefinition =
  React.forwardRef(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  ));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

type DropdownMenuRadioItemDefinition = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
  > &
    React.RefAttributes<
      React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>
    >
>;
const DropdownMenuRadioItem: DropdownMenuRadioItemDefinition = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
);
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

type DropdownMenuLabelDefinition = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
      inset?: boolean;
    }
  > &
    React.RefAttributes<React.ElementRef<typeof DropdownMenuPrimitive.Label>>
>;
const DropdownMenuLabel: DropdownMenuLabelDefinition = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

type DropdownMenuSeparatorDefinition = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
  > &
    React.RefAttributes<
      React.ElementRef<typeof DropdownMenuPrimitive.Separator>
    >
>;
const DropdownMenuSeparator: DropdownMenuSeparatorDefinition = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

type DropdownMenuShortcutDefinition = React.FC<
  React.HTMLAttributes<HTMLSpanElement>
>;
const DropdownMenuShortcut: DropdownMenuShortcutDefinition = ({
  className,
  ...props
}) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

type DropdownMenuDefinition = {
  Trigger: React.ForwardRefExoticComponent<
    DropdownMenuPrimitive.DropdownMenuTriggerProps &
      React.RefAttributes<HTMLButtonElement>
  >;
  Content: DropdownMenuContentDefinition;
  Item: DropdownMenuItemDefinition;
  CheckboxItem: DropdownMenuCheckboxItemDefinition;
  RadioItem: DropdownMenuRadioItemDefinition;
  Label: DropdownMenuLabelDefinition;
  Separator: DropdownMenuSeparatorDefinition;
  Shortcut: DropdownMenuShortcutDefinition;
  Group: React.ForwardRefExoticComponent<
    DropdownMenuPrimitive.DropdownMenuGroupProps &
      React.RefAttributes<HTMLDivElement>
  >;
  Portal: React.FC<DropdownMenuPrimitive.DropdownMenuPortalProps>;
  Sub: React.FC<DropdownMenuPrimitive.DropdownMenuSubProps>;
  SubTrigger: DropdownMenuSubTriggerDefinition;
  SubContent: DropdownMenuSubContentDefinition;
  RadioGroup: React.ForwardRefExoticComponent<
    DropdownMenuPrimitive.DropdownMenuRadioGroupProps &
      React.RefAttributes<HTMLDivElement>
  >;
} & React.FC<DropdownMenuPrimitive.DropdownMenuProps>;

// @ts-expect-error DropdownMenuContentDefinition is not assignable to type 'FC<DropdownMenuProps>'
const DropdownMenu: DropdownMenuDefinition = DropdownMenuPrimitive.Root;
DropdownMenu.Trigger = DropdownMenuPrimitive.Trigger;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.CheckboxItem = DropdownMenuCheckboxItem;
DropdownMenu.RadioItem = DropdownMenuRadioItem;
DropdownMenu.Label = DropdownMenuLabel;
DropdownMenu.Separator = DropdownMenuSeparator;
DropdownMenu.Shortcut = DropdownMenuShortcut;
DropdownMenu.Group = DropdownMenuPrimitive.Group;
DropdownMenu.Portal = DropdownMenuPrimitive.Portal;
DropdownMenu.Sub = DropdownMenuPrimitive.Sub;
DropdownMenu.SubTrigger = DropdownMenuSubTrigger;
DropdownMenu.SubContent = DropdownMenuSubContent;
DropdownMenu.RadioGroup = DropdownMenuPrimitive.RadioGroup;

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
};
