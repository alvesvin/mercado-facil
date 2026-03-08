import { router } from "expo-router";

// Required to be in a separate to avoid needing to mock router in all tests
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
