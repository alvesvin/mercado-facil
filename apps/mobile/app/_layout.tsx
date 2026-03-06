import "@/global.css";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { queryClient } from "@/lib/tanstack-query";
import { NAV_THEME } from "@/lib/theme";
import { TRPCProvider } from "@/lib/trpc";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: testing
    auth.signIn.anonymous().then(console.log).catch(console.error);
    // router.navigate("/_sitemap");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={api}>
        <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack screenOptions={{ headerShown: false }} />
          <PortalHost />
        </ThemeProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
}
