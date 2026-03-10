import type { Db } from "@mercado-facil/db";
import { productTable } from "@mercado-facil/db/schema";
import { ResourceNotFoundError } from "@mercado-facil/errors";
import { eq } from "drizzle-orm";
import { err, ok } from "neverthrow";
import { wrap } from "../../utils";
import type { CreateProductArgs } from "./types";

export class ProductRepository {
  constructor(private readonly db: Db) {}

  create(args: CreateProductArgs) {
    return wrap(this.db.insert(productTable).values(args).returning()).andThen(([product]) =>
      ok(product!),
    );
  }

  findByBarcode(barcode: string) {
    return wrap(
      this.db.select().from(productTable).where(eq(productTable.barcode, barcode)).limit(1),
    ).andThen(([product]) => {
      if (!product) return err(new ResourceNotFoundError("Produto não encontrado"));
      return ok(product);
    });
  }
}
