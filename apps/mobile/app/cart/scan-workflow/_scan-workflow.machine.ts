import { createActorContext } from "@xstate/react";
import { assign, fromPromise, setup } from "xstate";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/tanstack-query";

type Cart = { id: string; storeId: string | null };
type Product = { id: string; barcode: string };
type Price = { value: number; currency: string; type: "unit" | "per_kg" | "per_l" };

export type ScanWorkflowContext = {
  cart?: Cart;
  product?: Product & { isNew: boolean };
  price?: Price;
};

export type ScanWorkflowEvents =
  | { type: "STORE_FOUND"; store: { id: string } }
  | { type: "STORE_NOT_FOUND" }
  | { type: "PRODUCT_FOUND"; product: Product; price: Price }
  | { type: "PRODUCT_NOT_FOUND"; barcode: string }
  | { type: "CANCELLED" }
  | { type: "INFO_GOOD"; product: Product }
  | { type: "INFO_BAD"; product: Product }
  | { type: "PRICE_CONFIRMED"; price: Price }
  | { type: "PRICE_CANCELLED" };

const cartStartQueryKey = ["cart", "start", { type: "query" }];

const handleStoreFound = assign<
  ScanWorkflowContext,
  ScanWorkflowEvents & { type: "STORE_FOUND" },
  any,
  any,
  any
>({
  cart: ({ event, context }) => {
    const cart = { ...context.cart!, storeId: event.store.id };
    queryClient.setQueryData(cartStartQueryKey, cart);
    return cart;
  },
});

const handleInfoGood = assign<
  ScanWorkflowContext,
  ScanWorkflowEvents & { type: "INFO_GOOD" | "INFO_BAD" },
  any,
  any,
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
            price: ({ event }) => event.price,
          }),
        },
        PRODUCT_NOT_FOUND: {
          target: "takeProductPhoto",
          actions: assign({
            product: ({ event }) => ({ id: "", barcode: event.barcode, isNew: true }),
          }),
        },
      },
    },

    takeProductPhoto: {
      on: {
        INFO_GOOD: {
          target: "confirmPrice",
          actions: handleInfoGood,
        },
        INFO_BAD: { target: "newProductForm", actions: handleInfoGood },
        CANCELLED: { target: "scan" },
      },
    },

    newProductForm: {
      on: {
        INFO_GOOD: { target: "confirmPrice", actions: handleInfoGood },
      },
    },

    confirmPrice: {
      on: {
        PRICE_CONFIRMED: { target: "createProduct" },
        PRICE_CANCELLED: { target: "scan" },
      },
    },

    createProduct: {},
  },
});

export const ScanWorkflowActorContext = createActorContext(scanWorkflowMachine);
