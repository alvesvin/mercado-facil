import type { Db } from "@mercado-facil/db";
import { ProductMediaRepository } from "./ProductMediaRepository";
import type { CreateProductMediaArgs } from "./types";

export class ProductMediaService {
  constructor(private readonly productMediaRepository: ProductMediaRepository) {}

  withTransaction(db: Db) {
    return new ProductMediaService(new ProductMediaRepository(db));
  }

  create(args: CreateProductMediaArgs) {
    return this.productMediaRepository.create(args);
  }
}
