import { Hono } from "hono";
import { auth as authClient } from "./auth";
import { auth as authMiddleware } from "../../middlwares/auth";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./router";

export const app = new Hono()
    .use(authMiddleware(authClient))
    .use('*', trpcServer({ router: appRouter }))