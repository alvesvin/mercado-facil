import type { AppRouter } from "@mercado-facil/trpc/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type { AppRouter };
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type CreatePriceFn = (
  input: RouterInput["price"]["create"],
) => Promise<RouterOutput["price"]["create"]>;

export type UpdateCartStoreFn = (
  input: RouterInput["cart"]["updateStore"],
) => Promise<RouterOutput["cart"]["updateStore"]>;

export type CreateStoreFn = (
  input: RouterInput["store"]["create"],
) => Promise<RouterOutput["store"]["create"]>;

export type GenerateProductInfoFn = (
  input: RouterInput["ai"]["generateProductInfo"],
) => Promise<RouterOutput["ai"]["generateProductInfo"]>;
