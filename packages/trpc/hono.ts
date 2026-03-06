import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { auth } from "./auth";
import { createContext } from "./context";
import { appRouter } from "./router";

export const app = new Hono()
  .on(["GET", "POST"], "/api/trpc/auth/*", (c) => auth.handler(c.req.raw))
  .use("/api/trpc/*", trpcServer({ router: appRouter, createContext }));
