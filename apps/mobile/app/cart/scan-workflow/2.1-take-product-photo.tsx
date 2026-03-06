import { useMutation } from "@tanstack/react-query";
import { encode } from "base64-arraybuffer";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  createAnimatedComponent,
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutUp,
  interpolate,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
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

const loadingMessages = [
  "Estamos trabalhando nisso",
  "Logo mais estara pronto",
  "Lendo os detalhes do produto",
  "Organizando as informacoes para voce",
];

export default function TakeProductPhoto() {
  const actor = ScanWorkflowActorContext.useActorRef();

  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice("back");

  const [_photo, _setPhoto] = useState<PhotoFile>();
  const [isGeneratingProductInfo, setIsGeneratingProductInfo] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const buttonScale = useSharedValue(1);
  const glowProgress = useSharedValue(0);

  const trpc = useTRPC();
  const { mutateAsync: generateProductInfo } = useMutation(
    trpc.ai.generateProductInfo.mutationOptions(),
  );

  useEffect(() => {
    if (!isGeneratingProductInfo) {
      setLoadingMessageIndex(0);
      glowProgress.value = 0;
      return;
    }

    glowProgress.value = withRepeat(withTiming(1, { duration: 1800 }), -1, true);
    const interval = setInterval(() => {
      setLoadingMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 2100);

    return () => clearInterval(interval);
  }, [glowProgress, isGeneratingProductInfo]);

  const outerPulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowProgress.value, [0, 1], [0.2, 0.45]),
    transform: [{ scale: interpolate(glowProgress.value, [0, 1], [1, 1.18]) }],
  }));

  const innerPulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowProgress.value, [0, 1], [0.45, 0.2]),
    transform: [{ scale: interpolate(glowProgress.value, [0, 1], [0.92, 1.05]) }],
  }));

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
          product: productInfo,
        });
      } else {
        actor.send({
          type: "INFO_BAD",
          product: productInfo,
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
          className="bg-background items-center justify-center px-6"
        >
          <View className="absolute left-10 top-24 size-28 rounded-full bg-primary/10" />
          <View className="absolute right-8 top-40 size-16 rounded-full bg-emerald-500/10" />
          <View className="absolute bottom-28 left-12 size-20 rounded-full bg-sky-500/10" />
          <View className="absolute bottom-20 right-14 size-24 rounded-full bg-primary/5" />

          <Animated.View
            entering={FadeIn.duration(250)}
            className="w-full max-w-[340px] rounded-[32px] border border-border/70 bg-card px-8 py-10 items-center shadow-lg shadow-black/10"
          >
            <View className="relative size-40 items-center justify-center">
              <Animated.View
                style={outerPulseStyle}
                className="absolute size-40 rounded-full bg-primary/12"
              />
              <Animated.View
                style={innerPulseStyle}
                className="absolute size-28 rounded-full border border-primary/20 bg-primary/10"
              />
              <View className="size-20 items-center justify-center rounded-[28px] bg-primary">
                <View className="size-10 rounded-full bg-white/20" />
              </View>
              <View className="absolute right-3 top-6 size-4 rounded-full bg-emerald-400" />
              <View className="absolute bottom-5 left-4 size-3 rounded-full bg-sky-400" />
            </View>

            <View className="h-16 items-center justify-center self-stretch overflow-hidden">
              <Animated.View
                key={loadingMessages[loadingMessageIndex]}
                entering={FadeInUp.duration(350)}
                exiting={FadeOutUp.duration(250)}
                className="absolute inset-0 items-center justify-center px-4"
              >
                <Text variant="h3" className="text-center text-balance">
                  {loadingMessages[loadingMessageIndex]}
                </Text>
              </Animated.View>
            </View>
          </Animated.View>
        </AnimatedSafeAreaView>
      )}
    </>
  );
}
