import { router } from "../trpc";
import { ai } from "./ai";
import { blob } from "./blob";
import { cart } from "./cart";
import { price } from "./price";
import { product } from "./product";
import { store } from "./store";

export const appRouter = router({
  ai,
  cart,
  store,
  product,
  price,
  blob,
});

export type AppRouter = typeof appRouter;
