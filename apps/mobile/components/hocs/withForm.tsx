import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { Text, View } from "react-native";

type FormInputProps<Value = string> = {
  defaultValue?: Value;
  value?: Value;
  error?: string;
};

type FormInputConfigProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  control: Control<TFormValues>;
  containerClassName?: string;
};

export function withForm<Props extends FormInputProps, OnChange extends keyof Props = never>(
  Component: React.ComponentType<Props>,
  options?: { onChange?: OnChange },
) {
  const { onChange } = options ?? {};

  const Render = <TFormValues extends FieldValues>(
    props: Omit<Props, OnChange> & FormInputConfigProps<TFormValues>,
  ) => {
    const { name, control, containerClassName, ...rest } = props;
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          return (
            <View className={containerClassName}>
              <Component
                {...({
                  ...field,
                  ...rest,
                  error: fieldState.error?.message,
                  [onChange || "onChange"]: field.onChange,
                } as unknown as Props)}
              />
              {fieldState.error && (
                <Text role="alert" className="text-destructive mt-2">
                  {fieldState.error.message}
                </Text>
              )}
            </View>
          );
        }}
      />
    );
  };

  Render.displayName = `WithForm(${Component.displayName || Component.name || "Component"})`;

  return Render;
}
