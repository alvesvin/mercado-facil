import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

export default function HomePage() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: top + 8 }} className="flex-row pb-4">
      <Text variant="h4" className="text-center flex-1">
        Histórico de Compras
      </Text>
    </View>
  );
}
