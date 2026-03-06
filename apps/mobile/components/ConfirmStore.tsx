import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { ProductScanMachineContext } from "./ProductScanMachineContext";
import { Button } from "./ui/button";

export function ConfirmStore() {
  const { store, cart } = ProductScanMachineContext.useSelector((state) => ({
    store: state.context.store,
    cart: state.context.cart,
  }));
  const actoreRef = ProductScanMachineContext.useActorRef();

  if (!store || !cart) return null;

  function onConfirm() {
    actoreRef.send({ type: "store.confirm" });
  }

  function onReject() {
    actoreRef.send({ type: "store.reject" });
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
        <Button onPress={onReject} variant="secondary" size="lg" style={{ flex: 1 }}>
          <Text>Não</Text>
        </Button>
        <Button onPress={onConfirm} size="lg" style={{ flex: 1 }}>
          <Text>Sim</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
