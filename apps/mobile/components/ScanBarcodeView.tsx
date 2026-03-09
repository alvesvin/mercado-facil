import { useRef } from "react";
import { StyleSheet } from "react-native";
import { createAnimatedComponent, FadeInDown, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { codeTypes, getCanScan, type ScanBarcodeMachineState } from "./ScanBarcodeLogic";
import ScanCameraState from "./ScanCameraState";
import ScannerOverlay from "./ScannerOverlay";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

const AnimatedText = createAnimatedComponent(Text);

export function ScanBarcodeView(props: {
  state: ScanBarcodeMachineState;
  onCancel: () => void;
  onCodeScanned: (barcode: string) => void;
}) {
  const { state, onCancel, onCodeScanned } = props;

  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice("back");
  const canScan = getCanScan();

  const codeScanner = useCodeScanner({
    codeTypes,
    onCodeScanned: ([code]) => {
      if (!canScan(state)) return;
      onCodeScanned(code.value ?? "");
    },
  });

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
        isActive={canScan(state)}
        codeScanner={codeScanner}
      />

      <ScannerOverlay />

      {state === "idle" && (
        <AnimatedText
          entering={FadeInDown}
          exiting={FadeOut}
          variant="h3"
          className="text-center text-balance w-[250px] mx-auto mt-[10vh] text-white"
        >
          Aproxime a câmera do código de barras
        </AnimatedText>
      )}

      {state === "invalid" && (
        <AnimatedText
          entering={FadeInDown}
          exiting={FadeOut}
          variant="h3"
          className="text-center text-balance w-[250px] mx-auto mt-[10vh] text-white"
        >
          Código inválido. Tente novamente.
        </AnimatedText>
      )}

      {state === "validating" && (
        <AnimatedText
          entering={FadeInDown}
          exiting={FadeOut}
          variant="h3"
          className="text-center text-balance w-[250px] mx-auto mt-[10vh] text-white"
        >
          Validando, aguarde um momento...
        </AnimatedText>
      )}

      <Button
        onPress={onCancel}
        disabled={state === "validating"}
        size="lg"
        variant="destructive"
        className="absolute bottom-0 mb-[20vh]"
      >
        <Text>Cancelar</Text>
      </Button>
    </SafeAreaView>
  );
}
