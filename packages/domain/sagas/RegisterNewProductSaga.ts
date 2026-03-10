import type { Db } from "@mercado-facil/db";
import { z } from "zod";
import { BrandService } from "../features/brand/BrandService";
import { CartService } from "../features/cart/CartService";
import { PriceService } from "../features/price/PriceService";
import { ProductMediaService } from "../features/product/ProductMediaService";
import { ProductService } from "../features/product/ProductService";
import { ZProductQuantityUnitEnum } from "../features/product/types";
import { blobService } from "../features/singletons";
import type { Context } from "../types";
import { unwrapAsync, wrap } from "../utils";

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

export class RegisterNewProductSaga {
  constructor(private readonly db: Db) {}

  run(args: RegisterNewProductSagaArgs, ctx: Context) {
    return wrap(
      this.db.transaction(async (tx) => {
        const productService = ProductService.withTransaction(tx);
        const cartService = CartService.withTransaction(tx);
        const priceService = PriceService.withTransaction(tx);
        const brandService = BrandService.withTransaction(tx);
        const productMediaService = ProductMediaService.withTransaction(tx);

        const { user } = ctx.auth;

        const cart = await unwrapAsync(cartService.get(args.cartId));

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

        const brand = await unwrapAsync(brandService.create({ name: args.product.brand }));

        const product = await unwrapAsync(
          productService.create({ ...args.product, brand: brand.id }, ctx),
        );

        await productMediaService.create({
          productId: product.id,
          mediaType: "image",
          objectId: blob.id,
          tags: ["user-generated"],
        });

        const price = await unwrapAsync(
          priceService.create(
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
          cartService.addProduct(
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
    );
  }
}
