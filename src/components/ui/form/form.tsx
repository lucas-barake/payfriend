import React from "react";
import { Input } from "src/components/ui/form/input";
import { Select } from "src/components/ui/form/select";
import { Checkbox } from "src/components/ui/form/checkbox";
import { TextArea } from "$/components/ui/form/text-area";
import FileInput from "./file-input";
import { Switch } from "./switch/switch";
import { ListBox } from "./list-box";
import { cva, type VariantProps } from "class-variance-authority";
import { Group } from "$/components/ui/form/group";
import { Label } from "$/components/ui/form/label";
import { cn } from "$/lib/utils/cn";
import { FieldError } from "$/components/ui/form/field-error";
import { FieldDescription } from "$/components/ui/form/field-description";

const formVariants = cva("flex gap-4", {
  variants: {
    row: {
      true: "flex-row",
      false: "flex-col",
    },
  },
});
type FormProps = React.ComponentPropsWithoutRef<"form"> &
  VariantProps<typeof formVariants>;

const BaseForm: React.FC<FormProps> = ({
  className,
  row = false,
  ...props
}) => <form {...props} className={cn(formVariants({ className, row }))} />;

const Form = Object.assign(BaseForm, {
  Input,
  Select,
  TextArea,
  Checkbox,
  FileInput,
  Switch,
  ListBox,
  Group,
  Label,
  FieldError,
  FieldDescription,
});

export { Form, type FormProps };
