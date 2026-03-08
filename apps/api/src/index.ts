import { app as trpcApp } from "@mercado-facil/trpc/hono";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";
import adminApp from "./admin";

const app = new Hono();

app.use(secureHeaders(), timing());
app.route("/", trpcApp);
app.route("/admin", adminApp);

export default {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  fetch: app.fetch,
};
