import { betterAuth } from "better-auth";
import { anonymous } from 'better-auth/plugins'
import { expo } from '@better-auth/expo'
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db";

export const auth = betterAuth({
    plugins: [anonymous(), expo()],
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    baseURL: 'http://localhost:3000',
    basePath: '/api/trpc/auth',
    trustedOrigins: ["mercado-facil://", "exp://"],
    secret: process.env.RPC_BETTER_AUTH_SECRET,
    emailAndPassword: { enabled: true },
    advanced: {
        database: {
            generateId: false
        }
    }
})
