import { Effect } from "effect";
import { ProductRepository } from "./ProductRepository";

export class ProductService extends Effect.Service<ProductService>()(
  "ProductService",
  {
    effect: Effect.gen(function* () {
      const productRepository = yield* ProductRepository;

      return {
        create: productRepository.create.bind(productRepository),
        findByBarcode: productRepository.findByBarcode.bind(productRepository),
      };
    }),
  },
) {}
