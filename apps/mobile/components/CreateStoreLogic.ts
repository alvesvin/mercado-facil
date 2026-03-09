import type { CreateStoreFn } from "@mercado-facil/trpc-types";
import type { CreateStoreFormSchema } from "./CreateStoreForm";
import type { ScanWorkflowEmitter } from "./machines/scan-workflow.machine";

export async function handleCreateStore(
  deps: {
    values: CreateStoreFormSchema;
    latitude: number;
    longitude: number;
  },
  sideEffects: {
    createStore: CreateStoreFn;
    send: ScanWorkflowEmitter;
  },
) {
  const { values, latitude, longitude } = deps;
  const { createStore, send } = sideEffects;

  const store = await createStore({ ...values, latitude, longitude });

  send({ type: "STORE_FOUND", store: { id: store.id } });
}

export function handleCancelCreateStore(sideEffects: { send: ScanWorkflowEmitter }) {
  sideEffects.send({ type: "CANCELLED" });
}
