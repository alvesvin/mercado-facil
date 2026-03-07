import { auth } from "@/lib/auth";
import LoadingState from "./LoadingState";
import { useEffect, useEffectEvent } from "react";
import { posthog } from "@/lib/posthog";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = auth.useSession();
  const firstUsage = useAsyncStorage("is-first-usage");

  const setupAnonymousUser = useEffectEvent(async () => {
    const isFirstUsage = (await firstUsage.getItem()) !== "false";
    if (!isFirstUsage) return;
    await auth.signIn.anonymous();
  });

  // We want to automatically log in anonymously on first usage of the app
  useEffect(() => {
    if (data) return;
    setupAnonymousUser();
  }, [data]);

  // Identify user in PostHog
  useEffect(() => {
    if (!data) {
      posthog.reset();
      return;
    }
    posthog.identify(data.user.id, {
      email: data.user.email,
      name: data.user.name,
      session: {
        id: data.session.id,
        ip: data.session.ipAddress ?? null,
        ua: data.session.userAgent ?? null,
      },
    });
  }, [data]);

  if (isPending) return <LoadingState />;

  return <>{children}</>;
}
