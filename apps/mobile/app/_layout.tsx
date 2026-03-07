import "@/global.css";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { queryClient } from "@/lib/tanstack-query";
import { NAV_THEME } from "@/lib/theme";
import { TRPCProvider } from "@/lib/trpc";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "@/lib/posthog";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const lastPathname = useRef<string>(null);

  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    posthog.screen(pathname, params);
  }, [pathname, params]);

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider queryClient={queryClient} trpcClient={api}>
          <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack screenOptions={{ headerShown: false }} />
            <PortalHost />
          </ThemeProvider>
        </TRPCProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
}
