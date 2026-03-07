import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

type ProductProcessingLoadingStateProps = {
  mode: "create" | "add";
};

const copyByMode = {
  create: {
    title: "Criando produto",
    description:
      "Estamos salvando a foto, registrando os dados e adicionando o item ao seu carrinho.",
    badge: "Novo",
  },
  add: {
    title: "Adicionando ao carrinho",
    description: "Estamos vinculando o produto ao carrinho e preparando tudo para voce continuar.",
    badge: "Carrinho",
  },
} as const;

export default function ProductProcessingLoadingState({
  mode,
}: ProductProcessingLoadingStateProps) {
  const pulseProgress = useSharedValue(0);
  const floatProgress = useSharedValue(0);
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    pulseProgress.value = withRepeat(withTiming(1, { duration: 1800 }), -1, true);
    floatProgress.value = withRepeat(withTiming(1, { duration: 2200 }), -1, true);
    shimmerProgress.value = withRepeat(withTiming(1, { duration: 1400 }), -1, false);
  }, [floatProgress, pulseProgress, shimmerProgress]);

  const outerPulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseProgress.value, [0, 1], [0.16, 0.38]),
    transform: [{ scale: interpolate(pulseProgress.value, [0, 1], [1, 1.16]) }],
  }));

  const innerPulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseProgress.value, [0, 1], [0.24, 0.12]),
    transform: [{ scale: interpolate(pulseProgress.value, [0, 1], [0.92, 1.04]) }],
  }));

  const productCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatProgress.value, [0, 0.5, 1], [0, -10, 0]) },
      { rotate: `${interpolate(floatProgress.value, [0, 0.5, 1], [-2, 0, 2])}deg` },
    ],
  }));

  const cartBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulseProgress.value, [0, 0.5, 1], [0.94, 1.04, 0.94]) }],
    opacity: interpolate(pulseProgress.value, [0, 0.5, 1], [0.85, 1, 0.85]),
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmerProgress.value, [0, 1], [-72, 72]) }],
  }));

  const dotOneStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseProgress.value, [0, 0.5, 1], [0.35, 1, 0.35]),
    transform: [{ translateY: interpolate(pulseProgress.value, [0, 0.5, 1], [0, -4, 0]) }],
  }));

  const dotTwoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseProgress.value, [0, 0.5, 1], [1, 0.35, 1]),
    transform: [{ translateY: interpolate(pulseProgress.value, [0, 0.5, 1], [-4, 0, -4]) }],
  }));

  const copy = copyByMode[mode];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center overflow-hidden px-6">
        <View className="absolute left-10 top-24 size-24 rounded-full bg-primary/8" />
        <View className="absolute right-12 top-32 size-16 rounded-full bg-emerald-500/10" />
        <View className="absolute bottom-28 left-8 size-20 rounded-full bg-sky-500/10" />
        <View className="absolute bottom-16 right-10 size-28 rounded-full bg-primary/5" />

        <View className="w-full max-w-[344px] items-center rounded-[32px] border border-border/70 bg-card px-8 py-10 shadow-lg shadow-black/10">
          <View className="relative mb-8 size-48 items-center justify-center">
            <Animated.View
              style={outerPulseStyle}
              className="absolute size-48 rounded-full bg-primary/12"
            />
            <Animated.View
              style={innerPulseStyle}
              className="absolute size-36 rounded-full border border-primary/20 bg-primary/10"
            />

            <Animated.View
              style={productCardStyle}
              className="h-28 w-24 items-center rounded-[28px] border border-white/50 bg-primary pt-5 shadow-lg shadow-primary/20"
            >
              <View className="mb-4 h-3 w-10 rounded-full bg-white/90" />
              <View className="flex-row gap-1">
                <View className="h-8 w-1 rounded-full bg-white/85" />
                <View className="h-10 w-1 rounded-full bg-white/70" />
                <View className="h-7 w-1 rounded-full bg-white/90" />
                <View className="h-9 w-1 rounded-full bg-white/65" />
                <View className="h-6 w-1 rounded-full bg-white/90" />
                <View className="h-10 w-1 rounded-full bg-white/80" />
              </View>
            </Animated.View>

            <Animated.View
              style={cartBadgeStyle}
              className="absolute -right-2 top-10 h-14 w-16 items-center justify-center rounded-[18px] border-4 border-card bg-emerald-500"
            >
              <View className="mb-1 h-1.5 w-8 rounded-full bg-white/90" />
              <View className="flex-row gap-1">
                <View className="size-2 rounded-full bg-white/90" />
                <View className="size-2 rounded-full bg-white/90" />
              </View>
            </Animated.View>

            <View className="absolute bottom-6 left-1 rounded-full border border-border/60 bg-card px-3 py-2">
              <Text className="text-xs font-semibold text-foreground">{copy.badge}</Text>
            </View>
          </View>

          <View className="mb-6 w-full rounded-full bg-muted px-2 py-2">
            <View className="h-3 overflow-hidden rounded-full bg-primary/12">
              <Animated.View
                style={progressBarStyle}
                className="h-3 w-20 rounded-full bg-primary/70"
              />
            </View>
          </View>

          <Text variant="h3" className="text-center">
            {copy.title}
          </Text>
          <Text className="mt-3 text-center text-muted-foreground">{copy.description}</Text>

          <View className="mt-6 flex-row gap-2">
            <Animated.View style={dotOneStyle} className="size-3 rounded-full bg-sky-400" />
            <Animated.View style={dotTwoStyle} className="size-3 rounded-full bg-emerald-400" />
            <Animated.View style={dotOneStyle} className="size-3 rounded-full bg-primary/80" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
