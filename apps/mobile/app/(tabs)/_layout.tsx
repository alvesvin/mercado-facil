import { useRouter } from "expo-router";
import { TabList, TabSlot, Tabs, TabTrigger } from "expo-router/ui";
import { CameraIcon } from "phosphor-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export default function TabsLayout() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />
      <TabList className="" style={{ paddingBottom: bottom }}>
        <TabTrigger name="index" href="/" className="flex-1">
          <Text className="mx-auto">Home</Text>
        </TabTrigger>

        <View className="items-center justify-center w-[64px]">
          <Button
            size="icon"
            className="absolute size-[64px] rounded-full"
            onPress={() => {
              router.navigate("/cart/scan-workflow/1-find-nearby-store");
            }}
          >
            <Icon as={CameraIcon} weight="fill" size={40} className="text-blue-500" />
          </Button>
        </View>

        <View className="flex-1"></View>
      </TabList>
    </Tabs>
  );
}
