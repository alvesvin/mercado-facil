import type { Db } from "@mercado-facil/db";
import type { Context } from "../../types";
import { StoreRepository } from "./StoreRepository";
import type { CreateStoreArgs, FindNearArgs, SearchStoreArgs } from "./types";

export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  withTransaction(db: Db) {
    return new StoreService(new StoreRepository(db));
  }

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

  get(id: string) {
    return this.storeRepository.get(id);
  }
}
