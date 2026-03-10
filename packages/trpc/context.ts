import type { Context as HonoContext } from "hono";

export function createContext(_opts: unknown, c: HonoContext) {
  return { c };
}

export type Context = ReturnType<typeof createContext>;
