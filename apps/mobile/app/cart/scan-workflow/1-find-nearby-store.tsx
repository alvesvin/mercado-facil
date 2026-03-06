import { useMutation, useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRefreshOnFocus } from "@/components/hooks/useRefreshOnFocus";
import NearbyStoreLoadingState from "@/components/NearbyStoreLoadingState";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { findNearbyStoreWithLocationQueryOptions } from "@/data/queries/findNearbyStoreWithLocation";
import { useTRPC } from "@/lib/trpc";
import { ScanWorkflowActorContext } from "./_scan-workflow.machine";

/**
 * This checks cart state and routes accordingly.
 * 1. Cart has a store id, so we emit a STORE_FOUND event
 * 2. Cart does not have a store id, so we query for a nearby store
 * 3. If no store is found, we emit a STORE_NOT_FOUND event
 * 4. If a store is found, we prompt user to confirm it's correct. Depending on user's confirmation, we emit a STORE_FOUND or STORE_NOT_FOUND event
 */
export default function FindNearByStore() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const cart = ScanWorkflowActorContext.useSelector((state) => state.context.cart);

  const {
    data: store,
    isLoading: isLoadingStore,
    isRefetching: isRefetchingStore,
  } = useQuery({
    ...findNearbyStoreWithLocationQueryOptions,
    staleTime: 0,
    enabled: cart?.storeId === null,
  });

  useRefreshOnFocus(findNearbyStoreWithLocationQueryOptions.queryKey);

  const trpc = useTRPC();
  const { mutate: updateCartStore, isPending: isUpdatingCartStore } = useMutation(
    trpc.cart.updateStore.mutationOptions(),
  );

  // Since this is the first step, cart may not be available yet
  if (!cart) return <NearbyStoreLoadingState />;

  // 1. Cart has a store id, so we emit a STORE_FOUND event
  if (cart.storeId) {
    return actor.send({ type: "STORE_FOUND", store: { id: cart.storeId } });
  }

  // 2. Cart does not have a store id, so we query for a nearby store
  if (isLoadingStore || isRefetchingStore) return <NearbyStoreLoadingState />;

  // 3. If no store is found, we emit a STORE_NOT_FOUND event
  if (!store) return actor.send({ type: "STORE_NOT_FOUND" });

  // 4. If a store is found, we prompt user to confirm it's correct. Depending on user's confirmation, we emit a STORE_FOUND or STORE_NOT_FOUND event

  function confirm() {
    if (!store) return actor.send({ type: "STORE_NOT_FOUND" });
    updateCartStore(
      { cart: { id: cart!.id }, store: { id: store.id } },
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

  function reject() {
    actor.send({ type: "STORE_NOT_FOUND" });
  }

  return (
    <SafeAreaView style={{ paddingHorizontal: 24, paddingVertical: 48 }}>
      <Text variant="h1">Você está comprando em:</Text>
      <View style={{ paddingVertical: 48 }}>
        <View
          style={{
            width: 120,
            height: 120,
            marginBottom: 24,
            marginHorizontal: "auto",
            backgroundColor: "red",
            borderRadius: 8,
          }}
        ></View>
        <Text variant="h4" style={{ textAlign: "center" }}>
          {store.name ?? "—"} - {store.city ?? "—"}
        </Text>
        <Text variant="muted" style={{ textAlign: "center" }}>
          {store.address ?? "—"}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button
          disabled={isUpdatingCartStore}
          onPress={reject}
          variant="secondary"
          size="lg"
          style={{ flex: 1 }}
        >
          <Text>Não</Text>
        </Button>
        <Button disabled={isUpdatingCartStore} onPress={confirm} size="lg" style={{ flex: 1 }}>
          <Text>{isUpdatingCartStore ? "Confirmando..." : "Sim"}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
