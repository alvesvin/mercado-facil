import { Hono } from "hono";
import { auth } from "./auth";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./router";
import { createContext } from "./context";

export const app = new Hono()
  .on(["GET", "POST"], "/api/trpc/auth/*", (c) => auth.handler(c.req.raw))
  .use("/api/trpc/*", trpcServer({ router: appRouter, createContext }));
