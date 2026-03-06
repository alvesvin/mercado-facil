import { withTransaction } from "@mercado-facil/db/utils";
import { Effect } from "effect";
import { z } from "zod";
import { BlobService } from "../features/blob/BlobService";
import { BrandService } from "../features/brand/BrandService";
import { CartService } from "../features/cart/CartService";
import { PriceService } from "../features/price/PriceService";
import { ProductMediaService } from "../features/product/ProductMediaService";
import { ProductService } from "../features/product/ProductService";
import { StoreService } from "../features/store/StoreService";
import { RequestContext } from "../services/RequestContext";

export const ZRegisterNewProductSagaArgs = z.object({
  cartId: z.uuid(),
  storeId: z.uuid().nullish(),
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
    quantityUnit: z.string(),
    category: z.string().nullish(),
    subCategory: z.string().nullish(),
  }),
});
export type RegisterNewProductSagaArgs = z.infer<typeof ZRegisterNewProductSagaArgs>;

export const registerNewProductSaga = (args: RegisterNewProductSagaArgs) =>
  withTransaction(
    Effect.gen(function* () {
      const productService = yield* ProductService;
      const cartService = yield* CartService;
      const storeService = yield* StoreService;
      const priceService = yield* PriceService;
      const brandService = yield* BrandService;
      const blobService = yield* BlobService;
      const productMediaService = yield* ProductMediaService;
      const ctx = yield* RequestContext;
      const { user } = yield* ctx.auth;

      if (args.storeId) {
        yield* storeService.findById({ id: args.storeId });
      }

      const cart = yield* cartService.findById({ id: args.cartId });

      const blob = yield* blobService.uploadFile({
        upsert: true,
        bucket: "product-ug",
        path: `${user.id}/products/${args.product.barcode}.jpg`,
        file: {
          base64: args.media.base64,
          mimeType: args.media.mimeType || "image/jpeg",
        },
      });

      const brand = yield* brandService.create({ name: args.product.brand });

      const product = yield* productService
        .create({
          ...args.product,
          brand: brand.id,
        })
        .pipe(Effect.tapError((error) => Effect.logError(error.cause)));

      yield* productMediaService
        .create({
          productId: product.id,
          mediaType: "image",
          objectId: blob.id,
          tags: ["user-generated"],
        })
        .pipe(
          Effect.tapErrorCause((cause) => Effect.logError("Failed to create product media", cause)),
        );

      const price = yield* priceService.create({
        productId: product.id,
        storeId: args.storeId,
        userId: user.id,
        price: args.price.value,
        currency: args.price.currency,
        type: args.price.type,
      });

      const cartItem = yield* cartService.addProduct({
        cartId: cart.id,
        productId: product.id,
        priceId: price.id,
        quantity: 1,
      });

      return cartItem;
    }),
  ).pipe(Effect.tapErrorCause((cause) => Effect.logError("Failed to register new product", cause)));
