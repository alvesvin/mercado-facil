import type { Db } from "@mercado-facil/db";
import { productTable } from "@mercado-facil/db/schema";
import { ResourceNotFoundError } from "@mercado-facil/errors";
import { and, eq, isNull } from "drizzle-orm";
import { err, ok } from "neverthrow";
import { wrap } from "../../utils";
import type { CreateProductArgs } from "./types";

export class ProductRepository {
  private readonly FIELDS = {
    id: productTable.id,
    barcode: productTable.barcode,
    name: productTable.name,
    brand: productTable.brand,
    flavor: productTable.flavor,
    category: productTable.category,
    quantity: productTable.quantity,
    quantityUnit: productTable.quantityUnit,
    subCategory: productTable.subCategory,
    description: productTable.description,
    createdAt: productTable.createdAt,
  };

  constructor(private readonly db: Db) {}

  static withTransaction(db: Db) {
    return new ProductRepository(db);
  }

  create(args: CreateProductArgs) {
    return wrap(this.db.insert(productTable).values(args).returning(this.FIELDS)).andThen(
      ([product]) => ok(product!),
    );
  }

  buildFindByBarcodeWhere(barcode: string) {
    return and(eq(productTable.barcode, barcode), isNull(productTable.deletedAt));
  }

  findByBarcode(barcode: string) {
    return wrap(
      this.db
        .select(this.FIELDS)
        .from(productTable)
        .where(this.buildFindByBarcodeWhere(barcode))
        .limit(1),
    ).andThen(([product]) => {
      if (!product) return err(new ResourceNotFoundError("Produto não encontrado"));
      return ok(product);
    });
  }
}
