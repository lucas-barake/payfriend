import { type ComponentPropsWithoutRef, type FC } from "react";
import cn from "$/utils/cn";
import Input from "src/components/ui/form/input";
import Select from "src/components/ui/form/select";
import Checkbox from "src/components/ui/form/checkbox";
import TextArea from "$/components/ui/form/text-area/text-area";
import Group from "./group";
import RequiredStar from "./required-star";
import FileInput from "./file-input";
import Switch from "./switch";
import ListBox from "./list-box";
import { cva, type VariantProps } from "class-variance-authority";

const formVariants = cva("flex gap-2", {
  variants: {
    row: {
      default: "flex-col",
      true: "flex-row",
      false: "flex-col",
    },
  },
});
type FormProps = ComponentPropsWithoutRef<"form"> &
  VariantProps<typeof formVariants>;

type FormDefinition = FC<FormProps> & {
  Input: typeof Input;
  Select: typeof Select;
  TextArea: typeof TextArea;
  Checkbox: typeof Checkbox;
  Group: typeof Group;
  RequiredStar: typeof RequiredStar;
  FileInput: typeof FileInput;
  Switch: typeof Switch;
  ListBox: typeof ListBox;
};
const Form: FormDefinition = ({
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

Form.Input = Input;
Form.Select = Select;
Form.TextArea = TextArea;
Form.Checkbox = Checkbox;
Form.Group = Group;
Form.RequiredStar = RequiredStar;
Form.FileInput = FileInput;
Form.Switch = Switch;
Form.ListBox = ListBox;

export { Form, type FormProps };
