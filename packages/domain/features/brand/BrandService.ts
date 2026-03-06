import { Effect } from "effect";
import { BrandRepository } from "./BrandRepository";

export class BrandService extends Effect.Service<BrandService>()("BrandService", {
  effect: Effect.gen(function* () {
    const brandRepository = yield* BrandRepository;

    return {
      create: brandRepository.create.bind(brandRepository),
    };
  }),
}) {}
