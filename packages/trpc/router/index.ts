import { router } from "../trpc";
import { cart } from "./cart";
import { store } from "./store";

export const appRouter = router({
  cart,
  store,
});

export type AppRouter = typeof appRouter;
