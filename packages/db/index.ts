import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { accountTable, sessionTable, userTable, verificationTable } from "./schema";

export type { DrizzleQueryError } from "drizzle-orm";

// For better auth
const schema = {
  user: userTable,
  session: sessionTable,
  account: accountTable,
  verification: verificationTable,
};

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle({ client, schema });

export type Db = Omit<typeof db, "$client">;
