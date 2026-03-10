import type { Db } from "@mercado-facil/db";
import { ForbiddenError } from "@mercado-facil/errors";
import { errAsync, okAsync } from "neverthrow";
import type { Context } from "../../types";
import { CartItemRepository } from "./CartItemRepository";
import { CartRepository } from "./CartRepository";
import type { CreateCartItemArgs, IndexArgs } from "./types";

export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartItemRepository: CartItemRepository,
  ) {}

  withTransaction(db: Db) {
    return new CartService(new CartRepository(db), new CartItemRepository(db));
  }

  startCart(ctx: Context) {
    const { user } = ctx.auth;
    return this.cartRepository.getActiveByUserId({ user }).andThen((cart) => {
      if (cart) return okAsync(cart);
      return this.cartRepository.create({ user });
    });
  }

  updateStore(...args: Parameters<CartRepository["updateStore"]>) {
    return this.cartRepository.updateStore(...args);
  }

  get(id: string) {
    return this.cartRepository.get(id);
  }

  index(args: IndexArgs, ctx: Context) {
    const { user } = ctx.auth;
    return this.cartRepository.index({
      filter: { userId: user.id },
      pagination: args.pagination,
    });
  }

  addProduct(args: CreateCartItemArgs, ctx: Context) {
    const { user } = ctx.auth;

    return this.cartRepository.get(args.cartId).andThen((cart) => {
      if (cart.userId !== user.id) {
        return errAsync(
          new ForbiddenError("Você não tem permissão para adicionar produtos a este carrinho"),
        );
      }

      return this.cartItemRepository.create(args);
    });
  }
}
