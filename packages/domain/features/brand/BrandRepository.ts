import type { Db } from "@mercado-facil/db";
import { brandTable } from "@mercado-facil/db/schema";
import { sql } from "drizzle-orm";
import { ok } from "neverthrow";
import { wrap } from "../../utils";
import type { CreateBrandArgs } from "./types";

export class BrandRepository {
  constructor(private readonly db: Db) {}

  static withTransaction(db: Db) {
    return new BrandRepository(db);
  }

  create(args: CreateBrandArgs) {
    return wrap(
      this.db
        .insert(brandTable)
        .values({
          id: args.name,
          name: args.name,
        })
        .onConflictDoUpdate({
          target: [brandTable.id],
          set: { name: sql`excluded.name` },
        })
        .returning(),
    ).andThen(([brand]) => ok(brand!));
  }
}
