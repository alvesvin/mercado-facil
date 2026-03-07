import { randomUUIDv7 } from "bun";
import { sql } from "drizzle-orm";
import { db } from "../index";

type PublicTableIdColumn = {
  tableName: string;
  idType: string;
};

type TableRowId = {
  id: string;
};

const quoteIdentifier = (identifier: string) => `"${identifier.replaceAll('"', '""')}"`;
const publicTableName = (tableName: string) => `public.${quoteIdentifier(tableName)}`;
const log = (message: string) => process.stdout.write(`${message}\n`);

await db.transaction(async (tx) => {
  const tableResult = await tx.execute(sql<PublicTableIdColumn>`
    select
      c.table_name as "tableName",
      c.udt_name as "idType"
    from information_schema.columns c
    join information_schema.tables t
      on t.table_schema = c.table_schema
     and t.table_name = c.table_name
    where c.table_schema = 'public'
      and c.column_name = 'id'
      and t.table_type = 'BASE TABLE'
    order by c.table_name
  `);
  const tableRows = tableResult.rows as PublicTableIdColumn[];

  const tablesWithUuidIds = tableRows.filter((table) => table.idType === "uuid");
  const skippedTables = tableRows.filter((table) => table.idType !== "uuid");

  if (skippedTables.length > 0) {
    log(`Skipping non-UUID id tables: ${JSON.stringify(skippedTables)}`);
  }

  let updatedRowCount = 0;

  for (const { tableName } of tablesWithUuidIds) {
    const qualifiedTableName = publicTableName(tableName);
    const idResult = await tx.execute(sql<TableRowId>`
      select id
      from ${sql.raw(qualifiedTableName)}
    `);
    const tableRowIds = idResult.rows as TableRowId[];

    for (const { id } of tableRowIds) {
      await tx.execute(sql`
        update ${sql.raw(qualifiedTableName)}
        set id = ${randomUUIDv7()}
        where id = ${id}
      `);
    }

    updatedRowCount += tableRowIds.length;
    log(`Updated ${tableRowIds.length} rows in ${tableName}`);
  }

  log(
    `Updated ${updatedRowCount} rows across ${tablesWithUuidIds.length} public tables with UUID ids`,
  );
});
