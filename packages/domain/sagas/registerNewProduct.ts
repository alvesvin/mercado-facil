import { type DrizzleQueryError, db } from "@mercado-facil/db";
import { ResultAsync } from "neverthrow";
import { z } from "zod";
import { ZProductQuantityUnitEnum } from "../features/product/types";
import {
  blobService,
  brandService,
  cartService,
  priceService,
  productMediaService,
  productService,
} from "../features/singletons";
import type { Context } from "../types";
import { unwrapAsync } from "../utils";

export const ZRegisterNewProductSagaArgs = z.object({
  cartId: z.uuidv7(),
  storeId: z.uuidv7().nullish(),
  media: z.object({
    base64: z.base64(),
    mimeType: z.string().nullish(),
  }),
  price: z.object({
    currency: z.string(),
    type: z.enum(["unit", "per_kg", "per_l"]),
    value: z.number().positive(),
  }),
  product: z.object({
    barcode: z.string(),
    name: z.string(),
    brand: z.string(),
    flavor: z.string().nullish(),
    quantity: z.number(),
    quantityUnit: ZProductQuantityUnitEnum,
    category: z.string().nullish(),
    subCategory: z.string().nullish(),
  }),
});
export type RegisterNewProductSagaArgs = z.infer<typeof ZRegisterNewProductSagaArgs>;

export function registerNewProductSaga(args: RegisterNewProductSagaArgs, ctx: Context) {
  return ResultAsync.fromPromise(
    db.transaction(async (tx) => {
      const productServiceTx = productService.withTransaction(tx);
      const cartServiceTx = cartService.withTransaction(tx);
      const priceServiceTx = priceService.withTransaction(tx);
      const brandServiceTx = brandService.withTransaction(tx);
      const productMediaServiceTx = productMediaService.withTransaction(tx);

      const { user } = ctx.auth;

      const cart = await unwrapAsync(cartServiceTx.get(args.cartId));

      const blob = await unwrapAsync(
        blobService.uploadFile({
          upsert: true,
          bucket: "product-ug",
          path: `${user.id}/products/${args.product.barcode}.jpg`,
          file: {
            base64: args.media.base64,
            mimeType: args.media.mimeType || "image/jpeg",
          },
        }),
      );

      const brand = await unwrapAsync(brandServiceTx.create({ name: args.product.brand }));

      const product = await unwrapAsync(
        productServiceTx.create({ ...args.product, brand: brand.id }, ctx),
      );

      await productMediaServiceTx.create({
        productId: product.id,
        mediaType: "image",
        objectId: blob.id,
        tags: ["user-generated"],
      });

      const price = await unwrapAsync(
        priceServiceTx.create(
          {
            productId: product.id,
            storeId: args.storeId,
            price: args.price.value,
            currency: args.price.currency,
            type: args.price.type,
          },
          ctx,
        ),
      );

      const cartItem = await unwrapAsync(
        cartServiceTx.addProduct(
          {
            cartId: cart.id,
            productId: product.id,
            priceId: price.id,
            quantity: 1,
          },
          ctx,
        ),
      );

      return cartItem;
    }),
    (error) => error as DrizzleQueryError,
  );
}
