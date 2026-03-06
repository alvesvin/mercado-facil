import { useDebounce } from "@react-hook/debounce";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ShoppingCartIcon } from "phosphor-react-native";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocation } from "@/components/hooks/useLocation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useTRPC } from "@/lib/trpc";
import { formatDistance } from "@/lib/utils";
import { ScanWorkflowActorContext } from "./_scan-workflow.machine";

type Store = {
  id: string;
};

export default function FindStoreManual() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const cart = ScanWorkflowActorContext.useSelector((state) => state.context.cart)!;

  const { location } = useLocation();
  const [search, setSearch] = useDebounce("");

  const trpc = useTRPC();
  const { data: foundStores, isLoading: isLoadingStores } = useQuery({
    ...trpc.store.search.queryOptions({
      latitude: location?.coords.latitude ?? 0,
      longitude: location?.coords.longitude ?? 0,
      query: search,
    }),
    enabled: search.length >= 3 && !!location,
  });

  const { mutate: updateCartStore } = useMutation(trpc.cart.updateStore.mutationOptions());

  function handleNotFound() {
    actor.send({ type: "STORE_NOT_FOUND" });
  }

  function handleSelectStore(store: Store) {
    updateCartStore(
      { cart: { id: cart.id }, store: { id: store.id } },
      {
        onSuccess: () => {
          actor.send({ type: "STORE_FOUND", store: { id: store.id } });
        },
        onError: () => {
          actor.send({ type: "STORE_NOT_FOUND" });
        },
      },
    );
  }

  return (
    <SafeAreaView className="flex-1 gap-y-4">
      <View className="px-6">
        <Text variant="h1" className="text-center my-6">
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

      <FlashList
        className="px-6 py-2"
        data={foundStores}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListFooterComponent={() => {
          if (search.length < 3 || isLoadingStores) return null;
          return (
            <Button variant="ghost" size="lg" className="mt-4" onPress={handleNotFound}>
              <Text className="text-muted-foreground">Não conseguiu encontrar? Aperte aqui.</Text>
            </Button>
          );
        }}
        renderItem={({ item }) => {
          return (
            <Pressable onPress={() => handleSelectStore(item)}>
              <View className="flex-row gap-x-4 border-b border-border pb-4 relative">
                <Avatar alt={item.name} className="size-12 !rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    <Icon as={ShoppingCartIcon} className="text-muted-foreground size-6 shrink-0" />
                  </AvatarFallback>
                </Avatar>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text>{item.name}</Text>
                    <Text variant="muted">{formatDistance(Math.round(item.distance))}</Text>
                  </View>
                  <Text variant="muted" numberOfLines={2}>
                    {item.address}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
