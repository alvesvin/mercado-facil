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
import { ProductScanMachineContext } from "./ProductScanMachineContext";
import ScannerOverlay from "./ScannerOverlay";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export function ScanBarcode() {
  const actorRef = ProductScanMachineContext.useActorRef();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const scanned = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: actorRef.send whatever
  const onCodeScanned = useCallback(async ([code]: Code[]) => {
    if (!code.value) return;
    if (scanned.current) return;
    scanned.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    actorRef.send({ type: "scan.scanned", barcode: code.value });
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"],
    onCodeScanned,
  });

  if (!hasPermission) {
    requestPermission();
    return <Text>No permission</Text>;
  }
  if (!device) return <Text>No device</Text>;

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
      <Text variant="h3" className="text-center text-balance w-[250px] mx-auto mt-[10vh]">
        Aproxime a câmera do código de barras
      </Text>
      <Button size="lg" variant="destructive" className="absolute bottom-0 mb-[20vh]">
        <Text>Cancelar</Text>
      </Button>
    </SafeAreaView>
  );
}
