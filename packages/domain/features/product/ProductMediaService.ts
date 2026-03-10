import type { Db } from "@mercado-facil/db";
import { ProductMediaRepository } from "./ProductMediaRepository";
import type { CreateProductMediaArgs } from "./types";

export class ProductMediaService {
  constructor(private readonly productMediaRepository: ProductMediaRepository) {}

  static withTransaction(db: Db) {
    return new ProductMediaService(ProductMediaRepository.withTransaction(db));
  }

  create(args: CreateProductMediaArgs) {
    return this.productMediaRepository.create(args);
  }
}
