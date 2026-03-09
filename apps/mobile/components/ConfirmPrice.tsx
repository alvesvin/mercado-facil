import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ScanWorkflowActorContext } from "@/components/machines/scan-workflow.machine";
import { useTRPC } from "@/lib/trpc";
import { handleCancelConfirmPrice, handleConfirmPrice } from "./ConfirmPriceLogic";
import { ConfirmPriceView } from "./ConfirmPriceView";

export function ConfirmPrice() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const { cart, product, prices } = ScanWorkflowActorContext.useSelector((state) => ({
    cart: state.context.cart!,
    product: state.context.product!,
    prices: state.context.prices,
  }));

  const [value, setValue] = useState(prices.unit?.price ?? 0);

  const trpc = useTRPC();
  const { mutateAsync: createPrice, isPending: isCreatingPrice } = useMutation(
    trpc.price.create.mutationOptions(),
  );

  async function onConfirm() {
    try {
      await handleConfirmPrice(
        { value, prices, product, cart: { storeId: cart.storeId! } },
        { createPrice, send: actor.send },
      );
    } catch (error) {
      // TODO: handle error
      // biome-ignore lint/suspicious/noConsole: testing
      console.error(error);
    }
  }

  function onCancel() {
    handleCancelConfirmPrice({ send: actor.send });
  }

  return (
    <ConfirmPriceView
      isNewProduct={product.isNew}
      value={value}
      setValue={setValue}
      onCancel={onCancel}
      onConfirm={onConfirm}
      isCreatingPrice={isCreatingPrice}
    />
  );
}
