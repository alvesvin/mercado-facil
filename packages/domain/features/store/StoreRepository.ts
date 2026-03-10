import type { Db } from "@mercado-facil/db";
import { storeTable } from "@mercado-facil/db/schema";
import { ResourceNotFoundError } from "@mercado-facil/errors";
import { and, desc, eq, getColumns, isNotNull, isNull, or, sql } from "drizzle-orm";
import { err, ok } from "neverthrow";
import { wrap } from "../../utils";
import type { CreateStoreArgs, FindNearArgs, GetStoreArgs, SearchStoreArgs } from "./types";

const STORE_SEARCH_RADIUS_METERS = 10_000;

export class StoreRepository {
  constructor(private readonly db: Db) {}

  private makePoint(latitude: number, longitude: number) {
    return sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`;
  }

  buildVisibilityWhere(args: { userId?: string | null }) {
    const userClause = args.userId ? eq(storeTable.addedBy, args.userId) : undefined;
    return and(isNull(storeTable.deletedAt), or(isNotNull(storeTable.approvedAt), userClause));
  }

  create(args: CreateStoreArgs) {
    return wrap(
      this.db
        .insert(storeTable)
        .values({
          ...args,
          addedBy: args.userId,
          approvedAt: null,
          approvedBy: null,
          location: sql`ST_SetSRID(ST_MakePoint(${args.longitude}, ${args.latitude}), 4326)`,
        })
        .returning({
          id: storeTable.id,
          name: storeTable.name,
        }),
    ).andThen(([store]) => ok(store!));
  }

  buildSearchWhere(args: SearchStoreArgs) {
    const sqlPoint = this.makePoint(args.latitude, args.longitude);
    const normalizedQuery = args.query.trim().toLowerCase();

    return and(
      this.buildVisibilityWhere(args),
      sql`${normalizedQuery} <% ${storeTable.searchText}`,
      sql`ST_DWithin(${storeTable.location}::geography, ${sqlPoint}, ${STORE_SEARCH_RADIUS_METERS})`,
    );
  }

  search(args: SearchStoreArgs) {
    const sqlPoint = this.makePoint(args.latitude, args.longitude);
    const normalizedQuery = args.query.trim().toLowerCase();
    const distance = sql<number>`ST_Distance(${storeTable.location}::geography, ${sqlPoint})`;
    const similarity = sql<number>`word_similarity(${normalizedQuery}, ${storeTable.searchText})`;

    return wrap(
      this.db
        .select({
          id: storeTable.id,
          name: storeTable.name,
          address: storeTable.address,
          city: storeTable.city,
          state: storeTable.state,
          zip: storeTable.zip,
          country: storeTable.country,
          distance,
          similarity,
        })
        .from(storeTable)
        .where(this.buildSearchWhere(args))
        .orderBy(desc(similarity), distance)
        .limit(5),
    );
  }

  buildGetWhere(args: GetStoreArgs) {
    return and(eq(storeTable.id, args.id), this.buildVisibilityWhere(args));
  }

  get(args: GetStoreArgs) {
    const { searchText: _searchText, ...storeColumns } = getColumns(storeTable);

    return wrap(
      this.db.select(storeColumns).from(storeTable).where(this.buildGetWhere(args)).limit(1),
    ).andThen(([store]) => {
      if (!store) return err(new ResourceNotFoundError("Loja não encontrada"));
      return ok(store);
    });
  }

  buildFindNearWhere(args: FindNearArgs) {
    const sqlPoint = this.makePoint(args.latitude, args.longitude);

    return and(
      this.buildVisibilityWhere(args),
      sql`ST_DWithin(${storeTable.location}::geography, ${sqlPoint}, ${args.radius ?? 100})`,
    );
  }

  findNear(args: FindNearArgs) {
    const { searchText: _searchText, ...storeColumns } = getColumns(storeTable);
    const sqlPoint = this.makePoint(args.latitude, args.longitude);

    return wrap(
      this.db
        .select({
          ...storeColumns,
          distance: sql`ST_Distance(${storeTable.location}::geography, ${sqlPoint})`,
        })
        .from(storeTable)
        .where(this.buildFindNearWhere(args))
        .orderBy(sql`${storeTable.location}::geography <-> ${sqlPoint}`)
        .limit(1),
    ).andThen(([store]) => {
      if (!store) return err(new ResourceNotFoundError("Loja não encontrada"));
      return ok(store);
    });
  }
}
