import { useDebounce } from "@react-hook/debounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "@/lib/trpc";
import { handleNotFound, handleSelectStore, shouldFetchStores } from "./FindStoreManualLogic";
import { FindStoreManualView } from "./FindStoreManualView";
import { useLocation } from "./hooks/useLocation";
import { ScanWorkflowActorContext } from "./machines/scan-workflow.machine";

export function FindStoreManual() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const cart = ScanWorkflowActorContext.useSelector((state) => state.context.cart)!;

  const { location } = useLocation();
  const [search, setSearch] = useDebounce("");
  const [selectingStoreId, setSelectingStoreId] = useState("");

  const trpc = useTRPC();

  const { data: stores, isLoading: isLoadingStores } = useQuery({
    ...trpc.store.search.queryOptions({
      latitude: location?.coords.latitude ?? 0,
      longitude: location?.coords.longitude ?? 0,
      query: search,
    }),
    enabled: shouldFetchStores(search, !!location),
  });

  const { mutateAsync: updateCartStore } = useMutation(trpc.cart.updateStore.mutationOptions());

  function onNotFound() {
    handleNotFound(actor);
  }

  async function onSelectStore(storeId: string) {
    setSelectingStoreId(storeId);
    try {
      await handleSelectStore({ storeId, cartId: cart.id }, { updateCartStore, send: actor.send });
    } catch (error) {
      // TODO: handle error
      // biome-ignore lint/suspicious/noConsole: testing
      console.error(error);
    }
    setSelectingStoreId("");
  }

  return (
    <FindStoreManualView
      search={search}
      setSearch={setSearch}
      stores={stores || []}
      isLoading={isLoadingStores}
      onNotFound={onNotFound}
      onSelectStore={onSelectStore}
      selectingStoreId={selectingStoreId}
    />
  );
}
