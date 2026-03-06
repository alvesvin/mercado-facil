import { Effect } from "effect";
import { StoreRepository } from "./StoreRepository";

export class StoreService extends Effect.Service<StoreService>()("StoreService", {
  effect: Effect.gen(function* () {
    const storeRepository = yield* StoreRepository;

    return {
      search: storeRepository.search.bind(storeRepository),
      findById: storeRepository.findById.bind(storeRepository),
      findNear: storeRepository.findNear.bind(storeRepository),
    };
  }),
}) {}
