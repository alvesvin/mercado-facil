import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterNewProductForm } from "@/components/RegisterNewProductForm";
import { Text } from "@/components/ui/text";
import { ScanWorkflowActorContext } from "./_scan-workflow.machine";

export default function ConfirmProductInfo() {
  const actorRef = ScanWorkflowActorContext.useActorRef();
  const product = ScanWorkflowActorContext.useSelector((state) => state.context.product);

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
            type: "INFO_GOOD",
            product: {
              ...values,
              quantityUnit: values.quantityUnit.value,
            },
            id: "",
            barcode: "",
          });
        }}
      />
    </SafeAreaView>
  );
}
