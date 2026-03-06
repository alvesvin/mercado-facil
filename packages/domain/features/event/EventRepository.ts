import { eventTable } from "@mercado-facil/db/schema";
import { IDB } from "@mercado-facil/db/service";
import { Effect } from "effect";
import type { CreateEventArgs } from "./types";

export class EventRepository extends Effect.Service<EventRepository>()("EventRepository", {
  effect: Effect.gen(function* () {
    return {
      create: (args: CreateEventArgs) =>
        Effect.gen(function* () {
          const db = yield* IDB;
          return (yield* db.insert(eventTable).values(args).returning())[0]!;
        }),
    };
  }),
}) {}
