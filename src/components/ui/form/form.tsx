import React from "react";
import cn from "$/lib/utils/cn";
import Input from "src/components/ui/form/input";
import { Select } from "src/components/ui/form/select";
import { Checkbox } from "src/components/ui/form/checkbox";
import { TextArea } from "$/components/ui/form/text-area";
import Group from "./group";
import RequiredStar from "./required-star";
import FileInput from "./file-input";
import Switch from "./switch";
import { ListBox } from "./list-box";
import { cva, type VariantProps } from "class-variance-authority";

const formVariants = cva("flex gap-2", {
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
  children,
  ...props
}) => (
  <form
    {...props}
    className={cn("flex gap-2", formVariants({ className, row }))}
  >
    {children}
  </form>
);

const Form = Object.assign(BaseForm, {
  Input,
  Select,
  TextArea,
  Checkbox,
  Group,
  RequiredStar,
  FileInput,
  Switch,
  ListBox,
});

export { Form, type FormProps };
