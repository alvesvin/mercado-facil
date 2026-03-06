import { ConfirmPrice } from "@/components/ConfirmPrice";
import { ConfirmStore } from "@/components/ConfirmStore";
import { ProductScanMachineContext } from "@/components/ProductScanMachineContext";
import { RegisterNewFormMachine } from "@/components/RegisterNewFormMachine";
import { ScanBarcode } from "@/components/ScanBarcode";
import { TakeProductPhoto } from "@/components/TakeProductPhoto";
import { Text } from "@/components/ui/text";

export default function CartScanPage() {
  return (
    <ProductScanMachineContext.Provider>
      <CartScanPageComponent />
    </ProductScanMachineContext.Provider>
  );
}

function CartScanPageComponent() {
  const state = ProductScanMachineContext.useSelector((state) => state);

  if (state.matches("cart")) {
    return <Text>Loading...</Text>;
  }

  if (state.matches("confirmStore")) {
    return <ConfirmStore />;
  }

  if (state.matches("scan")) {
    return <ScanBarcode />;
  }

  if (state.matches("takeProductPhoto")) {
    return <TakeProductPhoto />;
  }

  if (state.matches("newProductForm")) {
    return <RegisterNewFormMachine />;
  }

  if (state.matches("confirmPrice")) {
    return <ConfirmPrice />;
  }

  return <Text>Cart scan page</Text>;
}
