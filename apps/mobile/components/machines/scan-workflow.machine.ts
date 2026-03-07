import { createActorContext } from "@xstate/react";
import { assign, fromPromise, setup } from "xstate";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/tanstack-query";

type Cart = { id: string; storeId: string | null };
type Product = {
  id: string;
  barcode: string;
  name?: string | null;
  brand?: string | null;
  flavor?: string | null;
  quantity?: number | null;
  quantityUnit?: "unit" | "kg" | "g" | "mg" | "l" | "ml" | "lb" | "oz" | "gal" | null;
  category?: string | null;
  subCategory?: string | null;
};
type Price = { id: string; price: number; currency: string; type: "unit" | "per_kg" | "per_l" };
type Prices = {
  unit?: Price;
  per_kg?: Price;
  per_l?: Price;
};

export type ScanWorkflowContext = {
  cart?: Cart;
  product?: Product & { isNew: boolean };
  photo?: { base64: string; mimeType: string };
  prices: Prices;
};

export type ScanWorkflowEvents =
  | { type: "STORE_FOUND"; store: { id: string } }
  | { type: "STORE_NOT_FOUND" }
  | { type: "PRODUCT_FOUND"; product: Product; prices: Prices }
  | { type: "PRODUCT_NOT_FOUND"; barcode: string }
  | { type: "CANCELLED" }
  | { type: "INFO_GOOD"; product: Omit<Product, "id" | "barcode"> }
  | { type: "PHOTO_TAKEN"; photo: { base64: string; mimeType: string } }
  | { type: "INFO_BAD"; product: Omit<Product, "id" | "barcode"> | null }
  | { type: "PRICE_CONFIRMED"; price: Price }
  | { type: "PRICE_CANCELLED" };

const cartStartQueryKey = ["cart", "start", { type: "query" }];

const handleStoreFound = assign<
  ScanWorkflowContext,
  ScanWorkflowEvents & { type: "STORE_FOUND" },
  // biome-ignore lint/suspicious/noExplicitAny: xstate types
  any,
  // biome-ignore lint/suspicious/noExplicitAny: xstate types
  any,
  // biome-ignore lint/suspicious/noExplicitAny: xstate types
  any
>({
  cart: ({ event, context }) => {
    const cart = { ...context.cart!, storeId: event.store.id };
    queryClient.setQueryData(cartStartQueryKey, cart);
    return cart;
  },
});

const handleInfoGoodBad = assign<
  ScanWorkflowContext,
  ScanWorkflowEvents & { type: "INFO_GOOD" | "INFO_BAD" },
  // biome-ignore lint/suspicious/noExplicitAny: xstate types
  any,
  // biome-ignore lint/suspicious/noExplicitAny: xstate types
  any,
  // biome-ignore lint/suspicious/noExplicitAny: xstate types
  any
>({
  product: ({ event, context }) => ({ ...context.product!, ...event.product }),
});

export const scanWorkflowMachine = setup({
  types: {
    context: {} as ScanWorkflowContext,
    events: {} as ScanWorkflowEvents,
  },
  actors: {
    getCart: fromPromise(async () => {
      const cart = await queryClient.fetchQuery({
        queryKey: cartStartQueryKey,
        queryFn: () => api.cart.start.query(),
        staleTime: 1000 * 60 * 15, // 15 minutes
      });
      return cart;
    }),
  },
}).createMachine({
  initial: "getCart",
  context: { prices: {} },
  states: {
    getCart: {
      invoke: {
        src: "getCart",
        onDone: [
          {
            guard: ({ event }) => !!event.output.storeId,
            actions: assign({ cart: ({ event }) => event.output }),
            target: "scan",
          },
          {
            guard: ({ event }) => !event.output.storeId,
            actions: assign({ cart: ({ event }) => event.output }),
            target: "findNearbyStore",
          },
        ],
      },
    },

    findNearbyStore: {
      on: {
        STORE_FOUND: { target: "scan", actions: handleStoreFound },
        STORE_NOT_FOUND: { target: "findStoreManual" },
      },
    },

    findStoreManual: {
      on: {
        STORE_FOUND: { target: "scan", actions: handleStoreFound },
        STORE_NOT_FOUND: { target: "newStore" },
      },
    },

    newStore: {
      on: { STORE_FOUND: { target: "scan", actions: handleStoreFound } },
    },

    scan: {
      on: {
        PRODUCT_FOUND: {
          target: "confirmPrice",
          actions: assign({
            product: ({ event }) => ({ ...event.product, isNew: false }),
            prices: ({ event }) => event.prices,
          }),
        },
        PRODUCT_NOT_FOUND: {
          target: "takeProductPhoto",
          actions: assign({
            product: ({ event }) => ({ id: "", barcode: event.barcode, isNew: true }),
          }),
        },
        CANCELLED: { target: "cancelled" },
      },
    },

    takeProductPhoto: {
      on: {
        INFO_GOOD: {
          target: "confirmPrice",
          actions: handleInfoGoodBad,
        },
        INFO_BAD: { target: "newProductForm", actions: handleInfoGoodBad },
        CANCELLED: { target: "scan" },
        PHOTO_TAKEN: { actions: assign({ photo: ({ event }) => event.photo }) },
      },
    },

    newProductForm: {
      on: {
        INFO_GOOD: { target: "confirmPrice", actions: handleInfoGoodBad },
      },
    },

    confirmPrice: {
      on: {
        PRICE_CONFIRMED: {
          target: "createProduct",
          actions: assign({
            prices: ({ event, context }) => ({
              ...context.prices,
              [event.price.type]: event.price,
            }),
          }),
        },
        PRICE_CANCELLED: { target: "scan" },
      },
    },

    createProduct: {},

    cancelled: {},
  },
});

export const ScanWorkflowActorContext = createActorContext(scanWorkflowMachine);
