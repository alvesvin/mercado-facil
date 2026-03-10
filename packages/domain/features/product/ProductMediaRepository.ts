import type { Db } from "@mercado-facil/db";
import { productMediaTable } from "@mercado-facil/db/schema";
import { ok } from "neverthrow";
import { wrap } from "../../utils";
import type { CreateProductMediaArgs } from "./types";

export class ProductMediaRepository {
  constructor(private readonly db: Db) {}

  create(args: CreateProductMediaArgs) {
    return wrap(this.db.insert(productMediaTable).values(args).returning()).andThen(
      ([productMedia]) => ok(productMedia!),
    );
  }
}
