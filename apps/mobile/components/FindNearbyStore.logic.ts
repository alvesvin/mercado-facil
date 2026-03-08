export function handleCartAlreadySet(
  deps: { cart: { storeId: string } },
  sideEffects: { send: (event: any) => void },
) {
  sideEffects.send({ type: "STORE_FOUND", store: { id: deps.cart.storeId } });
}

export function handleStoreNotFound(sideEffects: { send: (event: any) => void }) {
  sideEffects.send({ type: "STORE_NOT_FOUND" });
}

export async function handleConfirmStore(
  deps: { cart: { id: string }; store: { id: string } },
  sideEffects: { updateCartStore: (args: any) => Promise<any>; send: (event: any) => void },
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
