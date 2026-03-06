import { Effect } from "effect";
import { ProductMediaRepository } from "./ProductMediaRepository";

export class ProductMediaService extends Effect.Service<ProductMediaService>()(
  "ProductMediaService",
  {
    effect: Effect.gen(function* () {
      const productMediaRepository = yield* ProductMediaRepository;

      return {
        create: productMediaRepository.create.bind(productMediaRepository),
      };
    }),
  },
) {}
