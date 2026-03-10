import { describe, expect, it } from "bun:test";
import { auth } from "../auth";
import { t } from "../init";
import { appRouter } from "../router";

describe("index", () => {
  it("should return 200", async () => {
    const { user } = await auth.api.signInAnonymous();
    const caller = t.createCallerFactory(appRouter)({ auth: { user, session: {} } });
    const carts = await caller.cart.index({});
    expect(carts).toHaveLength(0);
  });
});
