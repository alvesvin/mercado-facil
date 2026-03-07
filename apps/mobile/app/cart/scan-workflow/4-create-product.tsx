import { useMutation } from "@tanstack/react-query";
import { useEffect, useEffectEvent } from "react";
import { ScanWorkflowActorContext } from "@/components/machines/scan-workflow.machine";
import ProductProcessingLoadingState from "@/components/ProductProcessingLoadingState";
import { useTRPC } from "@/lib/trpc";
import { goBackOrHome } from "@/lib/utils";

export default function CreateProduct() {
  const context = ScanWorkflowActorContext.useSelector((state) => state.context);
  const trpc = useTRPC();

  const { mutate: registerNewProduct } = useMutation(
    trpc.cart.reigsterNewProductSaga.mutationOptions(),
  );

  const { mutate: addProduct } = useMutation(trpc.cart.addProduct.mutationOptions());

  // TODO: add context validation safe guards
  const handleRegisterNewProduct = useEffectEvent(() => {
    registerNewProduct(
      {
        cartId: context.cart!.id,
        storeId: context.cart!.storeId,
        media: context.photo!,
        // TODO: handle price types correctly and price2
        price: {
          type: context.prices.unit!.type,
          value: context.prices.unit!.price,
          currency: context.prices.unit!.currency,
        },
        product: {
          name: context.product!.name!,
          brand: context.product!.brand!,
          quantity: context.product!.quantity!,
          quantityUnit: context.product!.quantityUnit!,
          category: context.product!.category,
          subCategory: context.product!.subCategory,
          barcode: context.product!.barcode,
        },
      },
      {
        // TODO: handle errors
        onSuccess: () => goBackOrHome("replace"),
        // biome-ignore lint/suspicious/noConsole: testing
        onError: console.error,
      },
    );
  });

  const handleAddProductToCart = useEffectEvent(async () => {
    addProduct(
      {
        cartId: context.cart!.id,
        productId: context.product!.id,
        priceId: context.prices.unit!.id,
        quantity: 1,
      },
      {
        // TODO: handle errors
        onSuccess: () => goBackOrHome("replace"),
        // biome-ignore lint/suspicious/noConsole: testing
        onError: console.error,
      },
    );
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: want to run on mount only
  useEffect(() => {
    if (context.product?.isNew) {
      handleRegisterNewProduct();
    } else {
      handleAddProductToCart();
    }
  }, []);

  return <ProductProcessingLoadingState mode={context.product?.isNew ? "create" : "add"} />;
}
