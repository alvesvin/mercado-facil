import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import NearbyStoreLoadingState from "./NearbyStoreLoadingState";

export function FindNearbyStoreView(props: {
  cart?: { store: { id: string } | null };
  store?: { name: string; city: string | null; address: string | null } | null;
  isLoading: boolean;
  isUpdatingCartStore: boolean;
  onConfirm: () => void;
  onReject: () => void;
}) {
  const { cart, store, isLoading, isUpdatingCartStore, onConfirm, onReject } = props;

  // Since this is the first step, cart may not be available yet
  if (!cart) return <NearbyStoreLoadingState />;

  if (isLoading || !store) return <NearbyStoreLoadingState />;

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
          onPress={onReject}
          variant="secondary"
          size="lg"
          style={{ flex: 1 }}
        >
          <Text>Não</Text>
        </Button>
        <Button disabled={isUpdatingCartStore} onPress={onConfirm} size="lg" style={{ flex: 1 }}>
          <Text>{isUpdatingCartStore ? "Confirmando..." : "Sim"}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
