import { beforeEach, describe, expect, it } from "bun:test";
import { db } from "@mercado-facil/db";
import { toSQL } from "../../tests/utils";
import { PriceRepository } from "./PriceRepository";

describe("PriceRepository", () => {
  let repository: PriceRepository;

  beforeEach(() => {
    repository = new PriceRepository(db);
  });

  describe("buildFindCreatedByUserIdTodayWhere", () => {
    it("excludes deleted prices", () => {
      const where = repository.buildFindCreatedByUserIdTodayWhere("123");
      const sql = toSQL(where);
      expect(sql).toContain("deleted_at is null");
    });

    it("includes prices created in the last 24 hours", () => {
      const where = repository.buildFindCreatedByUserIdTodayWhere("123");
      const sql = toSQL(where);
      expect(sql).toContain("created_at::date = now()::date");
    });
  });

  describe("buildSearchWhere", () => {
    it("excludes deleted prices", () => {
      const where = repository.buildSearchWhere({
        filters: { productId: "123", type: "unit" },
        pagination: { page: 1, limit: 10 },
      });
      const sql = toSQL(where);
      expect(sql).toContain("deleted_at is null");
    });

    it("includes prices for the given product", () => {
      const where = repository.buildSearchWhere({
        filters: { productId: "123", type: "unit" },
        pagination: { page: 1, limit: 10 },
      });
      const sql = toSQL(where);
      expect(sql).toContain("product_id = '123'");
    });

    it("includes prices for the given store", () => {
      const where = repository.buildSearchWhere({
        filters: { productId: "123", storeId: "123", type: "unit" },
        pagination: { page: 1, limit: 10 },
      });
      const sql = toSQL(where);
      expect(sql).toContain("store_id = '123'");
    });

    it("includes prices for the given type", () => {
      const where = repository.buildSearchWhere({
        filters: { productId: "123", type: "unit" },
        pagination: { page: 1, limit: 10 },
      });
      const sql = toSQL(where);
      expect(sql).toContain("type = 'unit'");
    });
  });
});
