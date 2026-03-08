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
  sideEffects: { createPrice: (args: any) => Promise<{ id: string }>; send: (event: any) => void },
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

export function handleCancelConfirmPrice(sideEffects: { send: (event: any) => void }) {
  sideEffects.send({ type: "PRICE_CANCELLED" });
}
