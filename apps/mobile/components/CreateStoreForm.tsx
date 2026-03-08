import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { FormInput } from "./FormInput";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export const ZCreateStoreFormSchema = z.object({
  name: z
    .string({ message: "Nome é obrigatório" })
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
});
export type CreateStoreFormSchema = z.infer<typeof ZCreateStoreFormSchema>;

export function CreateStoreForm(props: {
  initialValues?: Partial<CreateStoreFormSchema>;
  onSubmit: (values: CreateStoreFormSchema) => void;
  onCancel: () => void;
}) {
  const { initialValues, onSubmit, onCancel } = props;

  const form = useForm({
    resolver: zodResolver(ZCreateStoreFormSchema),
    defaultValues: initialValues as CreateStoreFormSchema,
  });

  const { control, handleSubmit } = form;
  const { isSubmitting } = useFormState({ control });

  return (
    <>
      <FormInput
        name="name"
        control={control}
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Digite o nome da loja"
        containerClassName="mb-6"
        className="h-14"
      />

      <View className="flex-row gap-x-4">
        <Button
          onPress={onCancel}
          disabled={isSubmitting}
          variant="ghost"
          size="lg"
          className="flex-1 border border-border"
        >
          <Text>Cancelar</Text>
        </Button>
        <Button
          disabled={isSubmitting}
          size="lg"
          className="flex-1"
          onPress={handleSubmit(onSubmit)}
        >
          <Text>Continuar</Text>
        </Button>
      </View>
    </>
  );
}
