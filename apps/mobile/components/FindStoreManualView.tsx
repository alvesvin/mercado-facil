import { FlashList } from "@shopify/flash-list";
import { BinocularsIcon, ShoppingCartIcon } from "phosphor-react-native";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import Reanimated, {
  Easing,
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { formatDistance } from "@/lib/utils";
import type { StoreItem } from "./FindStoreManualLogic";
import { shouldShowNotFoundButton } from "./FindStoreManualLogic";

const AnimatedText = Reanimated.createAnimatedComponent(Text);
const AnimatedButton = Reanimated.createAnimatedComponent(Button);

export function FindStoreManualView(props: {
  search: string;
  setSearch: (search: string) => void;
  stores: StoreItem[];
  isLoading: boolean;
  selectingStoreId: string;
  onNotFound: () => void;
  onSelectStore: (storeId: string) => void;
}) {
  const { search, setSearch, stores, isLoading, selectingStoreId, onNotFound, onSelectStore } =
    props;

  const orbitProgress = useSharedValue(0);

  useEffect(() => {
    orbitProgress.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [orbitProgress]);

  const binocularOrbitStyle = useAnimatedStyle(() => {
    const radius = 2;
    return {
      transform: [
        { translateX: Math.cos(orbitProgress.value) * radius },
        { translateY: Math.sin(orbitProgress.value) * radius },
      ],
    };
  });

  return (
    <SafeAreaView className="flex-1 gap-y-4">
      <View className="px-6">
        <Text variant="h1" className="text-left my-6">
          Onde você está comprando?
        </Text>

        <Input
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Digite o nome do estabelecimento"
          className="h-14"
          onChangeText={setSearch}
        />
      </View>

      {isLoading && (
        <View className="p-6 items-center gap-4">
          <Reanimated.View
            entering={FadeInDown.duration(200)}
            exiting={FadeOut}
            className="rounded-lg bg-muted size-20 items-center justify-center"
          >
            <Reanimated.View style={binocularOrbitStyle}>
              <Icon as={BinocularsIcon} className="size-12 text-muted-foreground" />
            </Reanimated.View>
          </Reanimated.View>
          <AnimatedText
            entering={FadeInDown.delay(75).duration(200)}
            exiting={FadeOut}
            variant="muted"
            className="text-center w-[200px] text-lg"
          >
            Buscando mercados próximos a você
          </AnimatedText>
        </View>
      )}

      {!isLoading && (
        <FlashList
          className="px-6 py-2"
          data={stores.filter((store) => !selectingStoreId || store.id === selectingStoreId)}
          ItemSeparatorComponent={() => <View className="h-4" />}
          ListFooterComponent={() => {
            if (!shouldShowNotFoundButton({ search, selectingStoreId, isLoading })) return null;
            return (
              <AnimatedButton
                entering={FadeInDown}
                exiting={FadeOut}
                variant="ghost"
                size="lg"
                className="mt-4"
                onPress={onNotFound}
              >
                <Text className="text-muted-foreground">Não conseguiu encontrar? Aperte aqui.</Text>
              </AnimatedButton>
            );
          }}
          renderItem={({ item }) => {
            return (
              <Pressable
                key={`select-store-${item.id}`}
                testID={`select-store-${item.id}`}
                disabled={!!selectingStoreId}
                onPress={() => onSelectStore(item.id)}
              >
                <Reanimated.View
                  entering={FadeInDown}
                  exiting={FadeOut}
                  layout={LinearTransition}
                  className="flex-row gap-x-4 border-b border-border pb-4 relative"
                >
                  {selectingStoreId ? (
                    <View className="size-12 rounded-lg bg-muted items-center justify-center">
                      <ActivityIndicator size="small" />
                    </View>
                  ) : (
                    <Avatar alt={item.name} className="size-12 !rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        <Icon
                          as={ShoppingCartIcon}
                          className="text-muted-foreground size-6 shrink-0"
                        />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text>{item.name}</Text>
                      <Text variant="muted">{formatDistance(Math.round(item.distance))}</Text>
                    </View>
                    <Text variant="muted" numberOfLines={2}>
                      {item.address}
                    </Text>
                  </View>
                </Reanimated.View>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
