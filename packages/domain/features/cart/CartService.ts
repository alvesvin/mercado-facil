import { ForbiddenError } from "@mercado-facil/errors";
import { Effect } from "effect";
import { RequestContext } from "../../services/RequestContext";
import { CartRepository } from "./CartRepository";
import type { AddProductArgs } from "./types";

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

      updateStore: cartRepository.updateStore.bind(cartRepository),

      findById: cartRepository.findById.bind(cartRepository),

      addProduct: (args: AddProductArgs) =>
        Effect.gen(function* () {
          const ctx = yield* RequestContext;
          const { user } = yield* ctx.auth;

          const cart = yield* cartRepository.findById({ id: args.cartId });

          if (cart.userId !== user.id) {
            return yield* Effect.fail(
              new ForbiddenError("Você não tem permissão para adicionar produtos a este carrinho"),
            );
          }

          const cartItem = yield* cartRepository.addProduct(args);

          return cartItem;
        }),
    };
  }),
}) {}
