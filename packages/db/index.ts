import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { accountTable, sessionTable, userTable, verificationTable } from "./schema";

// For better auth
const schema = {
  user: userTable,
  session: sessionTable,
  account: accountTable,
  verification: verificationTable,
};

// Disable prefetch as it is not supported for "Transaction" pool mode in Supabase
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle({
  client,
  schema,
});
