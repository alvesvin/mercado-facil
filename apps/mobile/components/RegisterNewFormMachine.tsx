import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductScanMachineContext } from "./ProductScanMachineContext";
import { RegisterNewProductForm } from "./RegisterNewProductForm";
import { Text } from "./ui/text";

export function RegisterNewFormMachine() {
  const actorRef = ProductScanMachineContext.useActorRef();
  const product = ProductScanMachineContext.useSelector((state) => state.context.product);

  return (
    <SafeAreaView className="px-6 flex-1">
      <View>
        <Text variant="h3" className="mb-2">
          Informações do produto
        </Text>
        <Text variant="muted">Revise as informações do produto.</Text>
      </View>
      <RegisterNewProductForm
        initialValues={{
          ...product,
          brand: product.brand ?? undefined,
          quantity: product.quantity ?? undefined,
          quantityUnit: product.quantityUnit
            ? {
                label: product.quantityUnit,
                value: product.quantityUnit,
              }
            : undefined,
        }}
        onSubmit={(values) => {
          actorRef.send({
            type: "product.register.new",
            product: {
              ...values,
              quantityUnit: values.quantityUnit.value,
            },
          });
        }}
      />
    </SafeAreaView>
  );
}
