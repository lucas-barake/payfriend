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

type FormProps = {
  row?: boolean;
} & ComponentPropsWithoutRef<"form">;

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
    className={cn("flex gap-2", row ? "flex-row" : "flex-col", className)}
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
