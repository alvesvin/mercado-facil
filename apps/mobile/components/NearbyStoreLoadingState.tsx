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

export default function NearbyStoreLoadingState() {
  const pulseProgress = useSharedValue(0);
  const floatProgress = useSharedValue(0);

  useEffect(() => {
    pulseProgress.value = withRepeat(withTiming(1, { duration: 1900 }), -1, true);
    floatProgress.value = withRepeat(withTiming(1, { duration: 2200 }), -1, true);
  }, [floatProgress, pulseProgress]);

  const outerPulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseProgress.value, [0, 1], [0.18, 0.42]),
    transform: [{ scale: interpolate(pulseProgress.value, [0, 1], [1, 1.18]) }],
  }));

  const innerPulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseProgress.value, [0, 1], [0.32, 0.18]),
    transform: [{ scale: interpolate(pulseProgress.value, [0, 1], [0.94, 1.06]) }],
  }));

  const floatingCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatProgress.value, [0, 1], [0, -8]) }],
  }));

  const dotOneStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseProgress.value, [0, 0.5, 1], [0.35, 1, 0.35]),
    transform: [{ translateY: interpolate(pulseProgress.value, [0, 0.5, 1], [0, -4, 0]) }],
  }));

  const dotTwoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseProgress.value, [0, 0.5, 1], [1, 0.35, 1]),
    transform: [{ translateY: interpolate(pulseProgress.value, [0, 0.5, 1], [-4, 0, -4]) }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-background px-6 items-center justify-center">
      <View className="absolute left-10 top-24 size-24 rounded-full bg-primary/8" />
      <View className="absolute right-12 top-36 size-16 rounded-full bg-emerald-500/10" />
      <View className="absolute bottom-32 left-12 size-20 rounded-full bg-sky-500/10" />
      <View className="absolute bottom-20 right-16 size-28 rounded-full bg-primary/5" />

      <View className="w-full max-w-[340px] items-center rounded-[32px] border border-border/70 bg-card px-8 py-10 shadow-lg shadow-black/10">
        <View className="relative mb-8 size-44 items-center justify-center">
          <Animated.View
            style={outerPulseStyle}
            className="absolute size-44 rounded-full bg-primary/12"
          />
          <Animated.View
            style={innerPulseStyle}
            className="absolute size-32 rounded-full border border-primary/20 bg-primary/10"
          />

          <Animated.View
            style={floatingCardStyle}
            className="size-24 rounded-[28px] bg-primary items-center justify-center shadow-lg shadow-primary/20"
          >
            <View className="h-10 w-14 rounded-t-2xl rounded-b-md bg-white/90" />
            <View className="absolute bottom-5 h-5 w-5 rounded-full bg-white/75" />
            <View className="absolute left-6 top-7 size-2 rounded-full bg-emerald-300" />
            <View className="absolute right-6 top-7 size-2 rounded-full bg-sky-300" />
          </Animated.View>

          <View className="absolute -right-1 top-7 rounded-full border-4 border-card bg-emerald-500 px-3 py-2">
            <Text className="text-xs font-semibold text-white">GPS</Text>
          </View>

          <View className="absolute bottom-5 left-3 flex-row gap-2">
            <Animated.View style={dotOneStyle} className="size-3 rounded-full bg-sky-400" />
            <Animated.View style={dotTwoStyle} className="size-3 rounded-full bg-emerald-400" />
            <Animated.View style={dotOneStyle} className="size-3 rounded-full bg-primary/80" />
          </View>
        </View>

        <Text variant="h3" className="text-center">
          Procurando mercado perto de voce
        </Text>
        <Text className="mt-3 text-center text-muted-foreground">
          Estamos usando sua localizacao para sugerir a loja mais proxima e acelerar o inicio da
          compra.
        </Text>
      </View>
    </SafeAreaView>
  );
}
