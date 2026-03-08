import type { UpdateCartStoreFn } from "@mercado-facil/trpc-types";
import type { ScanWorkflowEmitter } from "./machines/scan-workflow.machine";

export function handleCartAlreadySet(
  deps: { cart: { storeId: string } },
  sideEffects: { send: ScanWorkflowEmitter },
) {
  sideEffects.send({ type: "STORE_FOUND", store: { id: deps.cart.storeId } });
}

export function shouldFetchNearbyStores(cart?: { storeId: string | null }) {
  // Means cart is loaded and has no store id
  return Boolean(cart && cart.storeId === null);
}

export function shouldTriggerStoreFoundFromState(cart?: {
  storeId: string | null;
}): cart is { storeId: string } {
  // Means cart is loaded and has a store id
  return Boolean(cart?.storeId);
}

export function shouldTriggerStoreNotFoundFromState(args: {
  cart?: { storeId: string | null };
  store?: { id: string } | null;
  isRefetching: boolean;
}) {
  const { cart, store, isRefetching } = args;
  // Means cart is loaded, stores were loaded but not found
  return Boolean(cart && !isRefetching && store === null);
}

export function handleStoreNotFound(sideEffects: { send: ScanWorkflowEmitter }) {
  sideEffects.send({ type: "STORE_NOT_FOUND" });
}

export async function handleConfirmStore(
  deps: { cart: { id: string }; store: { id: string } },
  sideEffects: { updateCartStore: UpdateCartStoreFn; send: ScanWorkflowEmitter },
) {
  if (!deps.store) return sideEffects.send({ type: "STORE_NOT_FOUND" });
  try {
    await sideEffects.updateCartStore({ cart: { id: deps.cart.id }, store: { id: deps.store.id } });

    sideEffects.send({ type: "STORE_FOUND", store: { id: deps.store.id } });
  } catch (error) {
    // TODO: handle error
    // biome-ignore lint/suspicious/noConsole: testing
    console.error(error);
    sideEffects.send({ type: "STORE_NOT_FOUND" });
  }
}
