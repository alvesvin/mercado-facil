import { useMutation, useQuery } from "@tanstack/react-query";
import { findNearbyStoreWithLocationQueryOptions } from "@/data/queries/findNearbyStoreWithLocation";
import { useTRPC } from "@/lib/trpc";
import {
  handleCartAlreadySet,
  handleConfirmStore,
  handleStoreNotFound,
  shouldFetchNearbyStores,
  shouldTriggerStoreFoundFromState,
  shouldTriggerStoreNotFoundFromState,
} from "./FindNearbyStore.logic";
import { FindNearbyStoreView } from "./FindNearbyStore.view";
import { useRefreshOnFocus } from "./hooks/useRefreshOnFocus";
import { ScanWorkflowActorContext } from "./machines/scan-workflow.machine";

/**
 * This component checks cart state and routes accordingly.
 * 1. Cart has a store id, so we emit a STORE_FOUND event
 * 2. Cart does not have a store id, so we query for a nearby store
 * 3. If no store is found, we emit a STORE_NOT_FOUND event
 * 4. If a store is found, we prompt user to confirm it's correct. Depending on user's confirmation, we emit a STORE_FOUND or STORE_NOT_FOUND event
 */
export function FindNearByStore() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const cart = ScanWorkflowActorContext.useSelector((state) => state.context.cart);

  const {
    data: store,
    isLoading: isLoadingStore,
    isRefetching: isRefetchingStore,
  } = useQuery({
    ...findNearbyStoreWithLocationQueryOptions,
    staleTime: 0,
    // 2. Cart does not have a store id, so we query for a nearby store
    enabled: shouldFetchNearbyStores(cart),
  });

  useRefreshOnFocus(findNearbyStoreWithLocationQueryOptions.queryKey);

  const trpc = useTRPC();
  const { mutateAsync: updateCartStore, isPending: isUpdatingCartStore } = useMutation(
    trpc.cart.updateStore.mutationOptions(),
  );

  // 1. Cart has a store id, so we emit a STORE_FOUND event
  if (shouldTriggerStoreFoundFromState(cart)) {
    return handleCartAlreadySet({ cart: { storeId: cart.storeId } }, { send: actor.send });
  }

  // 3. If no store is found, we emit a STORE_NOT_FOUND event
  if (shouldTriggerStoreNotFoundFromState({ cart, store, isRefetching: isRefetchingStore })) {
    return handleStoreNotFound({ send: actor.send });
  }

  // 4. If a store is found, we prompt user to confirm it's correct. Depending on user's confirmation, we emit a STORE_FOUND or STORE_NOT_FOUND event

  async function confirm() {
    try {
      await handleConfirmStore(
        { cart: { id: cart!.id }, store: { id: store!.id } },
        { updateCartStore, send: actor.send },
      );
    } catch (error) {
      // TODO: handle error
      // biome-ignore lint/suspicious/noConsole: testing
      console.error(error);
    }
  }

  function reject() {
    handleStoreNotFound({ send: actor.send });
  }

  return (
    <FindNearbyStoreView
      cart={cart}
      isLoading={isLoadingStore || isRefetchingStore}
      store={store}
      isUpdatingCartStore={isUpdatingCartStore}
      onConfirm={confirm}
      onReject={reject}
    />
  );
}
