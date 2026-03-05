import { Effect } from "effect";
import { IDB } from "./service";

export const withTransaction = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  Effect.gen(function* () {
    const db = yield* IDB;
    return yield* db.transaction((tx) =>
      Effect.provideService(effect, IDB, tx as any),
    );
  });
