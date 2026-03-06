import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/client";
import { anonymousClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

export const auth = createAuthClient({
  plugins: [
    anonymousClient(),
    expoClient({
      scheme: "mercado-facil",
      storage: SecureStore,
    }),
  ],
  baseURL: "http://192.168.1.35:3000",
  basePath: "/api/trpc/auth",
  emailAndPassword: { enabled: true },
});
