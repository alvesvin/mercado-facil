import { useRouter } from "expo-router";
import { ArrowLeftIcon, CameraIcon } from "phosphor-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type ScanCameraStateVariant = "permission" | "device";

type ScanCameraStateProps = {
  variant: ScanCameraStateVariant;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
};

const paletteByVariant: Record<
  ScanCameraStateVariant,
  {
    outerRing: string;
    middleRing: string;
    cameraTile: string;
    accentBubble: string;
  }
> = {
  permission: {
    outerRing: "bg-amber-500/12",
    middleRing: "bg-amber-500/18",
    cameraTile: "bg-amber-500",
    accentBubble: "bg-amber-400",
  },
  device: {
    outerRing: "bg-sky-500/12",
    middleRing: "bg-sky-500/18",
    cameraTile: "bg-slate-900 dark:bg-slate-100",
    accentBubble: "bg-rose-500",
  },
};

export default function ScanCameraState({
  variant,
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
}: ScanCameraStateProps) {
  const router = useRouter();
  const palette = paletteByVariant[variant];
  const iconClassName = variant === "device" ? "text-white dark:text-slate-900" : "text-white";

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <View className="pt-2">
        <Button
          onPress={() => router.back()}
          variant="ghost"
          className="self-start rounded-full px-0"
        >
          <Icon as={ArrowLeftIcon} size={16} className="text-muted-foreground" />
          <Text className="text-muted-foreground">Voltar</Text>
        </Button>
      </View>

      <View className="flex-1 items-center">
        <View className="relative mb-10 size-64 items-center justify-center">
          <View className={cn("size-64 rounded-full", palette.outerRing)} />
          <View
            className={cn(
              "absolute size-48 rounded-full border border-border/60",
              palette.middleRing,
            )}
          />

          <View
            className={cn(
              "absolute size-32 rounded-[2rem] items-center justify-center shadow-lg shadow-black/10",
              palette.cameraTile,
            )}
          >
            <Icon as={CameraIcon} weight="fill" size={58} className={iconClassName} />
          </View>

          <View
            className={cn(
              "absolute right-7 top-8 size-16 items-center justify-center rounded-full border-4 border-background",
              palette.accentBubble,
            )}
          >
            <View className="h-1 w-7 rotate-[-35deg] rounded-full bg-white" />
          </View>

          <View className="absolute bottom-10 left-7 size-3 rounded-full bg-primary/60" />
          <View className="absolute bottom-4 right-12 size-2 rounded-full bg-primary/40" />
        </View>

        <View className="items-center">
          <View className="rounded-full bg-secondary px-4 py-2">
            <Text variant="small" className="uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </Text>
          </View>

          <Text variant="h3" className="mt-6 max-w-[320px] text-center">
            {title}
          </Text>

          <Text className="mt-3 max-w-[320px] text-center text-muted-foreground">
            {description}
          </Text>

          {actionLabel && onAction ? (
            <Button onPress={onAction} size="lg" className="mt-8 min-w-[220px] rounded-full">
              <Text>{actionLabel}</Text>
            </Button>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
