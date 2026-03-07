import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/client";
import { anonymousClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";
import { config } from "./config";

export const auth = createAuthClient({
  plugins: [
    anonymousClient(),
    expoClient({
      scheme: "mercado-facil",
      storage: SecureStore,
    }),
  ],
  baseURL: config.EXPO_PUBLIC_API_URL,
  basePath: "/api/trpc/auth",
  emailAndPassword: { enabled: true },
});
