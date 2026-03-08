import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateStoreForm, type CreateStoreFormSchema } from "./CreateStoreForm";
import { Text } from "./ui/text";

export function CreateStoreView(props: {
  onSubmit: (values: CreateStoreFormSchema) => void;
  onCancel: () => void;
}) {
  const { onSubmit, onCancel } = props;

  return (
    <SafeAreaView>
      <Text variant="h1" className="text-left text-balance mt-6 px-6">
        Qual o nome da loja que você está comprando?
      </Text>

      <View className="p-6">
        <CreateStoreForm onCancel={onCancel} onSubmit={onSubmit} />
      </View>
    </SafeAreaView>
  );
}
