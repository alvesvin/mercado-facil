import { createAuthClient } from 'better-auth/client'
import { anonymousClient } from 'better-auth/client/plugins'
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const auth = createAuthClient({
    plugins: [anonymousClient(), expoClient({
        scheme: 'mercado-facil',
        storage: SecureStore,
    })],
    baseURL: 'http://localhost:3000',
    basePath: '/rpc/auth',
    emailAndPassword: { enabled: true }
})