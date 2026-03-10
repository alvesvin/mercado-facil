import type { Db } from "@mercado-facil/db";
import { storeTable } from "@mercado-facil/db/schema";
import { ResourceNotFoundError } from "@mercado-facil/errors";
import { and, desc, eq, getColumns, isNotNull, isNull, or, sql } from "drizzle-orm";
import { err, ok } from "neverthrow";
import { wrap } from "../../utils";
import type { CreateStoreArgs, FindNearArgs, SearchStoreArgs } from "./types";

const STORE_SEARCH_RADIUS_METERS = 10_000;

export class StoreRepository {
  constructor(private readonly db: Db) {}

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
        .returning(),
    ).andThen(([store]) => ok(store!));
  }

  search(args: SearchStoreArgs) {
    const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${args.longitude}, ${args.latitude}), 4326)::geography`;
    const normalizedQuery = args.query.trim().toLowerCase();
    const distance = sql<number>`ST_Distance(${storeTable.location}::geography, ${sqlPoint})`;
    const similarity = sql<number>`word_similarity(${normalizedQuery}, ${storeTable.searchText})`;
    const userClause = args.userId ? eq(storeTable.addedBy, args.userId) : undefined;

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
        .where(
          and(
            isNull(storeTable.deletedAt),
            or(isNotNull(storeTable.approvedAt), userClause),
            sql`${normalizedQuery} <% ${storeTable.searchText}`,
            sql`ST_DWithin(${storeTable.location}::geography, ${sqlPoint}, ${STORE_SEARCH_RADIUS_METERS})`,
          ),
        )
        .orderBy(desc(similarity), distance)
        .limit(5),
    );
  }

  get(id: string) {
    const { searchText: _searchText, ...storeColumns } = getColumns(storeTable);

    return wrap(
      this.db
        .select(storeColumns)
        .from(storeTable)
        .where(and(eq(storeTable.id, id), isNull(storeTable.deletedAt)))
        .limit(1),
    ).andThen(([store]) => {
      if (!store) return err(new ResourceNotFoundError("Loja não encontrada"));
      return ok(store);
    });
  }

  findNear(args: FindNearArgs) {
    const { searchText: _searchText, ...storeColumns } = getColumns(storeTable);

    const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${args.longitude}, ${args.latitude}), 4326)::geography`;

    const userClause = args.userId ? eq(storeTable.addedBy, args.userId) : undefined;

    return wrap(
      this.db
        .select({
          ...storeColumns,
          distance: sql`ST_Distance(${storeTable.location}::geography, ${sqlPoint})`,
        })
        .from(storeTable)
        .where(
          and(
            isNull(storeTable.deletedAt),
            or(isNotNull(storeTable.approvedAt), userClause),
            sql`ST_DWithin(${storeTable.location}::geography, ${sqlPoint}, ${args.radius ?? 100})`,
          ),
        )
        .orderBy(sql`${storeTable.location}::geography <-> ${sqlPoint}`)
        .limit(1),
    ).andThen(([store]) => {
      if (!store) return err(new ResourceNotFoundError("Loja não encontrada"));
      return ok(store);
    });
  }
}
