import { drizzle } from "drizzle-orm/node-postgres";
import {
  userTable,
  sessionTable,
  accountTable,
  verificationTable,
} from "./schema";

// For better auth
const schema = {
  user: userTable,
  session: sessionTable,
  account: accountTable,
  verification: verificationTable,
};

export const db = drizzle(process.env.DATABASE_URL!, { schema });
