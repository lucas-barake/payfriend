import { type ComponentPropsWithoutRef, type FC } from "react";
import cs from "$/utils/cs";
import Input from "$/components/Form/Input";
import Select from "$/components/Form/Select";
import Checkbox from "$/components/Form/Checkbox";
import Textarea from "./Textarea/Textarea";
import Group from "./Group";
import RequiredStar from "./RequiredStar";
import FileInput from "./FileInput";
import Switch from "./Switch";
import ListBox from "./ListBox";

type Props = {
  row?: boolean;
} & ComponentPropsWithoutRef<"form">;

type FormDefinition = FC<Props> & {
  Input: typeof Input;
  Select: typeof Select;
  Textarea: typeof Textarea;
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
    className={cs("flex gap-2", row ? "flex-row" : "flex-col", className)}
  >
    {children}
  </form>
);

Form.Input = Input;
Form.Select = Select;
Form.Textarea = Textarea;
Form.Checkbox = Checkbox;
Form.Group = Group;
Form.RequiredStar = RequiredStar;
Form.FileInput = FileInput;
Form.Switch = Switch;
Form.ListBox = ListBox;

export default Form;
