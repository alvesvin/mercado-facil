import { Hono } from "hono";
import { app as trpc } from "@/ports/trpc";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";
import { auth as trpcAuth } from "@/ports/trpc/auth";
import { auth as authMiddleware } from "@/middlwares/auth";
import { wideEvents } from "@/middlwares/wide-events";

const app = new Hono();

app.use(secureHeaders(), timing(), wideEvents);

app.route("/api/trpc", trpc);

export default app;
