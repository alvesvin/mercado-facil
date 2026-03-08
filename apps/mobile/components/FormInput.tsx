import { withForm } from "./hocs/withForm";
import { Input } from "./ui/input";

export const FormInput = withForm(Input, { onChange: "onChangeText" });
