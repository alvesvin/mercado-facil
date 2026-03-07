import { type ClassValue, clsx } from "clsx";
import { router } from "expo-router";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(distance: number) {
  if (distance < 1000) {
    return `${distance}m`;
  }
  return `${(distance / 1000).toFixed(1)} km`;
}

export function goBackOrHome(replace: "replace" | "push" = "push") {
  if (router.canGoBack()) {
    router.back();
  } else {
    if (replace === "replace") {
      router.replace("/(tabs)");
    } else {
      router.push("/(tabs)");
    }
  }
}
