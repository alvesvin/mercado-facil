import type { Context as HonoContext } from "hono";
import { auth } from "./auth";

export async function createContext(_opts: unknown, c: HonoContext) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  return { auth: session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
