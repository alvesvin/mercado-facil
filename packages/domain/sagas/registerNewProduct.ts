import { Effect } from "effect";
import { ProductService } from "../features/product/ProductService";
import { CartService } from "../features/cart/CartService";
import { StoreService } from "../features/store/StoreService";
import { z } from "zod";
import { PriceService } from "../features/price/PriceService";
import { RequestContext } from "../services/RequestContext";
import { withTransaction } from "@mercado-facil/db/utils";
import { BrandService } from "../features/brand/BrandService";

export const ZRegisterNewProductSagaArgs = z.object({
  cartId: z.uuidv7(),
  storeId: z.uuidv7().optional(),
  price: z.object({
    currency: z.string(),
    type: z.enum(["unit", "per_kg", "per_l"]),
    value: z.number().int().positive(),
  }),
  product: z.object({
    barcode: z.string(),
    name: z.string(),
    brand: z.string(),
    flavor: z.string().optional(),
    quantity: z.number(),
    quantityUnit: z.string(),
    category: z.string().optional(),
    subCategory: z.string().optional(),
  }),
});
export type RegisterNewProductSagaArgs = z.infer<
  typeof ZRegisterNewProductSagaArgs
>;

export const registerNewProductSaga = (args: RegisterNewProductSagaArgs) =>
  withTransaction(
    Effect.gen(function* () {
      const productService = yield* ProductService;
      const cartService = yield* CartService;
      const storeService = yield* StoreService;
      const priceService = yield* PriceService;
      const brandService = yield* BrandService;
      const ctx = yield* RequestContext;
      const { user } = yield* ctx.auth;

      if (args.storeId) {
        yield* storeService.findById({ id: args.storeId });
      }

      const cart = yield* cartService.findById({ id: args.cartId });

      const brand = yield* brandService.create({ name: args.product.brand });

      const product = yield* productService.create({
        ...args.product,
        brand: brand.id,
      });

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
  );
