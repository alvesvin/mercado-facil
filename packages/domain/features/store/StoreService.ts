import type { Context } from "../../types";
import type { StoreRepository } from "./StoreRepository";
import type { CreateStoreArgs, FindNearArgs, GetStoreArgs, SearchStoreArgs } from "./types";

export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  create(args: CreateStoreArgs, ctx: Context) {
    const { user } = ctx.auth;
    return this.storeRepository.create({ ...args, userId: user.id });
  }

  search(args: Omit<SearchStoreArgs, "userId">, ctx: Context) {
    const { user } = ctx.auth;
    return this.storeRepository.search({ ...args, userId: user.id });
  }

  findNear(args: Omit<FindNearArgs, "userId">, ctx: Context) {
    const { user } = ctx.auth;
    return this.storeRepository.findNear({ ...args, userId: user.id });
  }

  get(args: Omit<GetStoreArgs, "userId">, ctx: Context) {
    const { user } = ctx.auth;
    return this.storeRepository.get({ ...args, userId: user.id });
  }
}
