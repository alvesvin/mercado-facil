import type { Db } from "@mercado-facil/db";
import type { Context } from "../../types";
import { ProductRepository } from "./ProductRepository";
import type { CreateProductArgs } from "./types";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  withTransaction(db: Db) {
    return new ProductService(new ProductRepository(db));
  }

  create(args: Omit<CreateProductArgs, "userId">, ctx: Context) {
    const { user } = ctx.auth;
    return this.productRepository.create({ ...args, userId: user.id });
  }

  findByBarcode(barcode: string) {
    return this.productRepository.findByBarcode(barcode);
  }
}
