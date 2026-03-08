import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { handleCancelCreateStore, handleCreateStore } from "./CreateStore.logic";
import { CreateStoreView } from "./CreateStore.view";
import type { CreateStoreFormSchema } from "./CreateStoreForm";
import { useLocation } from "./hooks/useLocation";
import { ScanWorkflowActorContext } from "./machines/scan-workflow.machine";

export function CreateStore() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const { location } = useLocation();

  const trpc = useTRPC();
  const { mutateAsync: createStore } = useMutation(trpc.store.create.mutationOptions());

  async function onSubmit(values: CreateStoreFormSchema) {
    try {
      // TODO: assign this store to cart
      await handleCreateStore(
        {
          values,
          latitude: location?.coords.latitude ?? 0,
          longitude: location?.coords.longitude ?? 0,
        },
        { createStore, send: actor.send },
      );
    } catch (error) {
      // TODO: handle error
      // biome-ignore lint/suspicious/noConsole: testing
      console.error(error);
    }
  }

  function onCancel() {
    handleCancelCreateStore({ send: actor.send });
  }

  return <CreateStoreView onSubmit={onSubmit} onCancel={onCancel} />;
}
