import { type jest, mock } from "bun:test";
import { db } from "@mercado-facil/db";
import { storeTable } from "@mercado-facil/db/schema";
import type { SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";

export function toSQL(where: SQL | undefined) {
  const dialect = new PgDialect();
  const sql = db.select().from(storeTable).where(where).getSQL().inlineParams();
  return dialect.sqlToQuery(sql).sql.replace(/"/g, "");
}

export type MockClass<T extends object> = T & { [K in keyof T]: jest.Mock };
export function mockClass<T extends object>() {
  const mocks = new Map<string, jest.Mock>();
  const proxy = new Proxy(
    {},
    {
      get(_, prop) {
        if (!mocks.has(prop as string) && prop !== "call") {
          mocks.set(prop as string, mock());
        }
        return mocks.get(prop as string);
      },
    },
  );
  return proxy as MockClass<T>;
}
