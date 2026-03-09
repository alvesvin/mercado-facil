import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoadingState() {
  return (
    <SafeAreaView testID="loading-state" className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="size-16 items-center justify-center rounded-full border border-border/60 bg-card">
          <ActivityIndicator size="small" />
        </View>
      </View>
    </SafeAreaView>
  );
}
