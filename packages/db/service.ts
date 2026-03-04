import * as PgDrizzle from "drizzle-orm/effect-postgres";
import { PgClient } from "@effect/sql-pg";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import { types } from "pg";

// Configure the PgClient layer
const PgClientLive = PgClient.layer({
  url: Redacted.make(process.env.DATABASE_URL!),
  types: {
    getTypeParser: (typeId, format) => {
      if (
        [1184, 1114, 1082, 1186, 1231, 1115, 1185, 1187, 1182].includes(typeId)
      ) {
        return (val: any) => val;
      }
      return types.getTypeParser(typeId, format);
    },
  },
});

// Create the DB effect with default services
const dbEffect = PgDrizzle.make().pipe(
  Effect.provide(PgDrizzle.DefaultServices),
);

// Define a DB service tag for dependency injection
export class IDB extends Context.Tag("DB")<
  IDB,
  Effect.Effect.Success<typeof dbEffect>
>() {}

// Create a layer that provides the DB service
const DBLive = Layer.effect(
  IDB,
  Effect.gen(function* () {
    return yield* dbEffect;
  }),
);

// Compose all layers together
export const DB = Layer.provideMerge(DBLive, PgClientLive);
