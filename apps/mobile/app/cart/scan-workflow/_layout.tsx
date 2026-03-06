import { type Href, router, Stack, usePathname } from "expo-router";
import { useEffect, useEffectEvent } from "react";
import { scheduleOnRN } from "react-native-worklets";
import { ScanWorkflowActorContext } from "./_scan-workflow.machine";

export default function CartScanWorkflowLayout() {
  return (
    <ScanWorkflowActorContext.Provider>
      <CartScanWorkflowLayoutContent />
    </ScanWorkflowActorContext.Provider>
  );
}

function CartScanWorkflowLayoutContent() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const path = usePathname();

  const subscribe = useEffectEvent(() => {
    function safeReplace(target: Href) {
      if (target === path) return;
      // This is an attempt to fix "cannot update a component while rendering a different component"
      scheduleOnRN(() => router.replace(target));
    }

    return actor.subscribe((state) => {
      if (state.matches("findNearbyStore")) {
        safeReplace("/cart/scan-workflow/1-find-nearby-store");
      }
      if (state.matches("findStoreManual")) {
        safeReplace("/cart/scan-workflow/1.1-find-store-manual");
      }
      if (state.matches("newStore")) {
        safeReplace("/cart/scan-workflow/1.2-create-store");
      }
      if (state.matches("scan")) {
        safeReplace("/cart/scan-workflow/2-scan-barcode");
      }
      if (state.matches("takeProductPhoto")) {
        safeReplace("/cart/scan-workflow/2.1-take-product-photo");
      }
      if (state.matches("newProductForm")) {
        safeReplace("/cart/scan-workflow/2.2-confirm-product-info");
      }
      if (state.matches("confirmPrice")) {
        safeReplace("/cart/scan-workflow/3-confirm-price");
      }
      if (state.matches("createProduct")) {
        safeReplace("/cart/scan-workflow/4-create-product");
      }
    });
  });

  useEffect(() => {
    const subscription = subscribe();
    return () => subscription.unsubscribe();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
