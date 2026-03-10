import { beforeEach, describe, expect, it } from "bun:test";
import { db } from "@mercado-facil/db";
import { toSQL } from "../../tests/utils";
import { ProductRepository } from "./ProductRepository";

describe("ProductRepository", () => {
  let repository: ProductRepository;

  beforeEach(() => {
    repository = new ProductRepository(db);
  });

  describe("buildFindByBarcodeWhere", () => {
    it("excludes deleted products", () => {
      const where = repository.buildFindByBarcodeWhere("123");
      const sql = toSQL(where);
      expect(sql).toContain("deleted_at is null");
    });
  });
});
