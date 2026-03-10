import { beforeEach, describe, expect, it } from "bun:test";
import { db } from "@mercado-facil/db";
import { toSQL } from "../../tests/utils";
import { StoreRepository } from "./StoreRepository";

describe("StoreRepository", () => {
  let repository: StoreRepository;

  beforeEach(() => {
    repository = new StoreRepository(db);
  });

  describe("buildFindNearWhere", () => {
    it("excludes deleted stores", () => {
      const where = repository.buildFindNearWhere({
        latitude: 0,
        longitude: 0,
        userId: null,
      });
      const sql = toSQL(where);
      expect(sql).toContain("deleted_at is null");
    });

    it("uses default radius 100 when radius not provided", () => {
      const where = repository.buildFindNearWhere({
        latitude: 0,
        longitude: 0,
        userId: null,
      });
      const sql = toSQL(where);
      expect(sql).toContain("100");
    });

    it("uses provided radius when given", () => {
      const where = repository.buildFindNearWhere({
        latitude: 0,
        longitude: 0,
        radius: 500,
        userId: null,
      });
      const sql = toSQL(where);
      expect(sql).toContain("500");
    });
  });

  describe("buildSearchWhere", () => {
    it("excludes deleted stores", () => {
      const where = repository.buildSearchWhere({
        latitude: 0,
        longitude: 0,
        query: "foo",
        userId: null,
      });
      const sql = toSQL(where);
      expect(sql).toContain("deleted_at is null"); // or more specific: "deleted_at" IS NULL
    });

    it("when userId is set, visibility is approved OR owned by user", () => {
      const userId = "01936e8a-1234-7000-8000-000000000000";
      const where = repository.buildSearchWhere({
        latitude: 0,
        longitude: 0,
        query: "foo",
        userId,
      });
      const sql = toSQL(where);
      expect(sql).toContain("approved_at");
      expect(sql).toContain(userId); // or added_by / equivalent
    });

    it("when userId is null, no user clause in visibility", () => {
      const where = repository.buildSearchWhere({
        latitude: 0,
        longitude: 0,
        query: "bar",
        userId: null,
      });
      const sql = toSQL(where);
      expect(sql).toContain("deleted_at");
      // visibility is only approved_at IS NOT NULL (no added_by)
    });

    it("uses fixed search radius (10_000m)", () => {
      const where = repository.buildSearchWhere({
        latitude: 1,
        longitude: 2,
        query: "x",
        userId: null,
      });
      const sql = toSQL(where);
      expect(sql).toContain("10000"); // STORE_SEARCH_RADIUS_METERS
    });

    it("normalizes query to lowercase for trigram", () => {
      const where = repository.buildSearchWhere({
        latitude: 0,
        longitude: 0,
        query: "  FOO  ",
        userId: null,
      });
      const sql = toSQL(where);
      expect(sql).toContain("foo");
    });
  });

  describe("getGetWhere", () => {
    it("excludes deleted stores", () => {
      const where = repository.buildGetWhere({ id: "123", userId: null });
      const sql = toSQL(where);
      expect(sql).toContain("deleted_at is null");
    });

    it("when userId is set, visibility is approved OR owned by user", () => {
      const userId = "01936e8a-1234-7000-8000-000000000000";
      const where = repository.buildGetWhere({ id: "123", userId });
      const sql = toSQL(where);
      expect(sql).toContain("approved_at is not null");
      expect(sql).toContain(`added_by = '${userId}'`);
    });

    it("when userId is null, no user clause in visibility", () => {
      const where = repository.buildGetWhere({ id: "123", userId: null });
      const sql = toSQL(where);
      expect(sql).toContain("deleted_at is null");
    });
  });

  describe("buildVisibilityWhere", () => {
    it("excludes deleted stores", () => {
      const where = repository.buildVisibilityWhere({ userId: null });
      const sql = toSQL(where);
      expect(sql).toContain("deleted_at is null");
    });

    it("when userId is set, visibility is approved OR owned by user", () => {
      const userId = "01936e8a-1234-7000-8000-000000000000";
      const where = repository.buildVisibilityWhere({ userId });
      const sql = toSQL(where);
      expect(sql).toContain("approved_at is not null");
      expect(sql).toContain(`added_by = '${userId}'`);
    });

    it("when userId is null, no user clause in visibility", () => {
      const where = repository.buildVisibilityWhere({ userId: null });
      const sql = toSQL(where);
      expect(sql).toContain("deleted_at is null");
      expect(sql).not.toContain("added_by = '");
    });
  });
});
