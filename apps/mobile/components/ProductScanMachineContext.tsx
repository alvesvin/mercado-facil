import { createActorContext } from "@xstate/react";
import { scanProductMachine } from "@/state-machines/scanProductMachine";

export const ProductScanMachineContext =
  createActorContext<typeof scanProductMachine>(scanProductMachine);
