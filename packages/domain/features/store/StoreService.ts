import { Effect, Either } from "effect";
import { RequestContext } from "../../services/RequestContext";
import { StoreRepository } from "./StoreRepository";
import type { CreateStoreArgs, FindNearArgs, SearchStoreArgs } from "./types";

export class StoreService extends Effect.Service<StoreService>()("StoreService", {
  effect: Effect.gen(function* () {
    const storeRepository = yield* StoreRepository;

    return {
      create: (args: Omit<CreateStoreArgs, "userId">) =>
        Effect.gen(function* () {
          const ctx = yield* RequestContext;
          const user = yield* ctx.auth.pipe(
            Effect.map((ctx) => ctx.user),
            Effect.either,
          );
          const store = yield* storeRepository.create({
            ...args,
            userId: Either.isRight(user) ? user.right.id : undefined,
          });
          return store;
        }),

      search: (args: Omit<SearchStoreArgs, "userId">) =>
        Effect.gen(function* () {
          const ctx = yield* RequestContext;
          const user = yield* ctx.auth.pipe(
            Effect.map((ctx) => ctx.user),
            Effect.either,
          );
          const stores = yield* storeRepository.search({
            ...args,
            userId: Either.isRight(user) ? user.right.id : undefined,
          });
          return stores;
        }),
      findNear: (args: Omit<FindNearArgs, "userId">) =>
        Effect.gen(function* () {
          const ctx = yield* RequestContext;
          const user = yield* ctx.auth.pipe(
            Effect.map((ctx) => ctx.user),
            Effect.either,
          );
          const store = yield* storeRepository.findNear({
            ...args,
            userId: Either.isRight(user) ? user.right.id : undefined,
          });
          return store;
        }),
      findById: storeRepository.findById.bind(storeRepository),
    };
  }),
}) {}
