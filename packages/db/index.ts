import { drizzle } from "drizzle-orm/node-postgres";
import { accountTable, sessionTable, userTable, verificationTable } from "./schema";

// For better auth
const schema = {
  user: userTable,
  session: sessionTable,
  account: accountTable,
  verification: verificationTable,
};

export const db = drizzle(process.env.DATABASE_URL!, { schema });
