import type { Db } from "@mercado-facil/db";
import { BrandRepository } from "./BrandRepository";
import type { CreateBrandArgs } from "./types";

export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  withTransaction(db: Db) {
    return new BrandService(new BrandRepository(db));
  }

  create(args: CreateBrandArgs) {
    return this.brandRepository.create(args);
  }
}
