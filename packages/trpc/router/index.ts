import { router } from "../trpc";
import { product } from "./product";
import { cart } from "./cart";
import { store } from "./store";
import { ai } from "./ai";
import { price } from "./price";

export const appRouter = router({
  ai,
  cart,
  store,
  product,
  price,
});

export type AppRouter = typeof appRouter;
