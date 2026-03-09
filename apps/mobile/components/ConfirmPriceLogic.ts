import type { CreatePriceFn } from "@mercado-facil/trpc-types";
import type { ScanWorkflowEmitter } from "./machines/scan-workflow.machine";

export function shouldCreatePrice(args: {
  product: { isNew: boolean };
  prices: { unit?: { id: string; price: number } };
  value: number;
}) {
  const { product, prices, value } = args;
  return !product.isNew && (!prices.unit?.id || value !== prices.unit?.price);
}

export async function handleConfirmPrice(
  deps: {
    value: number;
    prices: { unit?: { id: string; price: number } };
    product: { id: string; isNew: boolean };
    cart: { storeId: string };
  },
  sideEffects: { createPrice: CreatePriceFn; send: ScanWorkflowEmitter },
) {
  let priceId = deps.prices.unit?.id ?? "";

  if (shouldCreatePrice({ product: deps.product, prices: deps.prices, value: deps.value })) {
    const newPrice = await sideEffects.createPrice({
      storeId: deps.cart.storeId,
      productId: deps.product.id,
      price: deps.value,
      currency: "BRL",
      type: "unit",
    });
    priceId = newPrice.id;
  }

  // TODO: instead of creating price here, create only at the end
  // TODO: limit new price creation to 150 per user per day

  sideEffects.send({
    type: "PRICE_CONFIRMED",
    // TODO: handle new price vs accepted price logic
    price: {
      id: priceId,
      price: deps.value,
      currency: "BRL",
      type: "unit",
    },
  });
}

export function handleCancelConfirmPrice(sideEffects: { send: ScanWorkflowEmitter }) {
  sideEffects.send({ type: "PRICE_CANCELLED" });
}
