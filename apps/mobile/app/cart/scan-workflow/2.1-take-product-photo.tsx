import { useMutation } from "@tanstack/react-query";
import { encode } from "base64-arraybuffer";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  createAnimatedComponent,
  FadeOut,
  SlideInDown,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  type PhotoFile,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import ScanCameraState from "@/components/ScanCameraState";
import { Text } from "@/components/ui/text";
import { useTRPC } from "@/lib/trpc";
import { ScanWorkflowActorContext } from "./_scan-workflow.machine";

const AnimatedSafeAreaView = createAnimatedComponent(SafeAreaView);

export default function TakeProductPhoto() {
  const actor = ScanWorkflowActorContext.useActorRef();

  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice("back");

  const [_photo, _setPhoto] = useState<PhotoFile>();
  const [isGeneratingProductInfo, setIsGeneratingProductInfo] = useState(false);

  const buttonScale = useSharedValue(1);

  const trpc = useTRPC();
  const { mutateAsync: generateProductInfo } = useMutation(
    trpc.ai.generateProductInfo.mutationOptions(),
  );

  async function takePhoto() {
    setIsGeneratingProductInfo(true);
    try {
      const file = await camera.current?.takePhoto({
        enableShutterSound: true,
      });
      if (!file) return;
      const result = await fetch(`file://${file.path}`);
      const base64 = encode(await result.arrayBuffer());

      const productInfo = await generateProductInfo({
        images: [{ base64, mime: "image/jpeg" }],
      });

      if (productInfo?.quantity && productInfo.quantityUnit) {
        actor.send({
          type: "INFO_GOOD",
          product: {
            ...productInfo,
            id: "",
            barcode: "",
          },
        });
      } else {
        actor.send({
          type: "INFO_BAD",
          product: {
            ...productInfo,
            id: "",
            barcode: "",
          },
        });
      }
    } finally {
      setIsGeneratingProductInfo(false);
    }
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
    <>
      <SafeAreaView className="flex-1">
        <Camera
          androidPreviewViewType="surface-view"
          ref={camera}
          device={device}
          photo
          isActive={!isGeneratingProductInfo}
          style={StyleSheet.absoluteFill}
          photoQualityBalance="speed"
        />
        <View className="bg-black/50 p-4 w-[250px] mx-auto mt-[10vh] rounded-lg">
          <Text variant="h3" className="text-center text-balance">
            Tire uma foto do produto de frente
          </Text>
        </View>
        <View className="absolute inset-x-0 bottom-10 items-center">
          <Pressable onPress={takePhoto}>
            <Animated.View
              style={{ transform: [{ scale: buttonScale }] }}
              onTouchStart={() => (buttonScale.value = withSpring(0.8, { duration: 100 }))}
              onTouchEnd={() => (buttonScale.value = withSpring(1, { duration: 100 }))}
              className="size-24 border-[8px] border-white rounded-full items-center justify-center"
            >
              <View className="size-16 rounded-full bg-white/50" />
            </Animated.View>
          </Pressable>
        </View>
      </SafeAreaView>

      {isGeneratingProductInfo && (
        <AnimatedSafeAreaView
          entering={SlideInDown}
          exiting={FadeOut}
          style={StyleSheet.absoluteFill}
          className="bg-background"
        >
          <Text>Gerando informações do produto...</Text>
        </AnimatedSafeAreaView>
      )}
    </>
  );
}
