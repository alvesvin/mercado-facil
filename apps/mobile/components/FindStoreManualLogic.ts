import type { StoreSelect } from "@mercado-facil/domain-types";
import type { UpdateCartStoreFn } from "@mercado-facil/trpc-types";
import type { ScanWorkflowEmitter } from "./machines/scan-workflow.machine";

export type StoreItem = Pick<StoreSelect, "id" | "name" | "address"> & { distance: number };

export function shouldShowNotFoundButton(args: {
  search: string;
  selectingStoreId: string;
  isLoading: boolean;
}) {
  const { search, selectingStoreId, isLoading } = args;
  return search.length >= 1 && !isLoading && !selectingStoreId;
}

export function shouldFetchStores(search: string, hasLocation: boolean) {
  return search.length >= 1 && hasLocation;
}

export function handleNotFound(sideEffects: { send: ScanWorkflowEmitter }) {
  sideEffects.send({ type: "STORE_NOT_FOUND" });
}

export async function handleSelectStore(
  deps: { storeId: string; cartId: string },
  sideEffects: { send: ScanWorkflowEmitter; updateCartStore: UpdateCartStoreFn },
) {
  try {
    await sideEffects.updateCartStore({ cart: { id: deps.cartId }, store: { id: deps.storeId } });
    sideEffects.send({ type: "STORE_FOUND", store: { id: deps.storeId } });
  } catch (error) {
    // TODO: handle error
    // biome-ignore lint/suspicious/noConsole: testing
    console.error(error);
    sideEffects.send({ type: "STORE_NOT_FOUND" });
  }
}
