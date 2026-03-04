import { Effect } from "effect";
import { CartRepository } from "./CartRepository";
import { RequestContext } from "../../services/RequestContext";

export class CartService extends Effect.Service<CartService>()("CartService", {
  effect: Effect.gen(function* () {
    const cartRepository = yield* CartRepository;

    return {
      startCart: () =>
        Effect.gen(function* () {
          const ctx = yield* RequestContext;
          const { user } = yield* ctx.auth;
          const cart = yield* cartRepository.getActiveByUserId({
            user,
          });
          if (cart) return cart;
          const newCart = yield* cartRepository.create({ user });
          return newCart;
        }),
    };
  }),
}) {}
