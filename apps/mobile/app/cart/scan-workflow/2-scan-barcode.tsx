import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useCallback, useRef } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  type Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { ScanWorkflowActorContext } from "@/components/machines/scan-workflow.machine";
import ScanCameraState from "@/components/ScanCameraState";
import ScannerOverlay from "@/components/ScannerOverlay";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";

export default function ScanBarcode() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const cart = ScanWorkflowActorContext.useSelector((state) => state.context.cart)!;

  const { hasPermission, requestPermission } = useCameraPermission();
  const queryClient = useQueryClient();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice("back");
  const scanned = useRef(false);

  const onCodeScanned = useCallback(
    async ([code]: Code[]) => {
      if (!code.value || !cart.storeId) return;
      if (scanned.current) return;
      scanned.current = true;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const product = await queryClient.fetchQuery({
        queryKey: ["product", "findWithPriceByBarcodeSaga", { barcode: code.value, type: "query" }],
        queryFn: () =>
          api.product.findWithPriceByBarcodeSaga.query({
            barcode: code.value!,
            storeId: cart.storeId!,
          }),
      });

      if (product) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        actor.send({
          type: "PRODUCT_FOUND",
          product: product.product,
          prices: product.prices,
        });
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        actor.send({ type: "PRODUCT_NOT_FOUND", barcode: code.value! });
      }
    },
    [queryClient, cart.storeId, actor],
  );

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13", "ean-8"],
    onCodeScanned,
  });

  function cancel() {
    actor.send({ type: "CANCELLED" });
  }

  if (!hasPermission) {
    return (
      <ScanCameraState
        variant="permission"
        eyebrow="Acesso a camera"
        title="Precisamos da camera para escanear"
        description="Autorize o acesso para ler o codigo de barras e continuar o fluxo do carrinho."
        actionLabel="Permitir acesso"
        onAction={() => {
          void requestPermission();
        }}
      />
    );
  }
  if (!device) {
    return (
      <ScanCameraState
        variant="device"
        eyebrow="Camera indisponivel"
        title="Nenhuma camera encontrada"
        description="Nao conseguimos acessar a camera traseira neste aparelho agora. Tente novamente em instantes."
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center">
      <Camera
        ref={camera}
        device={device}
        style={StyleSheet.absoluteFill}
        className="absolute"
        isActive
        codeScanner={codeScanner}
      />
      <ScannerOverlay />
      <Text
        variant="h3"
        className="text-center text-balance w-[250px] mx-auto mt-[10vh] text-white"
      >
        Aproxime a câmera do código de barras
      </Text>
      <Button
        onPress={cancel}
        size="lg"
        variant="destructive"
        className="absolute bottom-0 mb-[20vh]"
      >
        <Text>Cancelar</Text>
      </Button>
    </SafeAreaView>
  );
}
