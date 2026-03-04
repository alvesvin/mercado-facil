import { Effect } from "effect";
import { IDB } from "@mercado-facil/db/service";
import type { CreateEventArgs } from "./types";
import { eventTable } from "@mercado-facil/db/schema";

export class EventRepository extends Effect.Service<EventRepository>()(
  "EventRepository",
  {
    effect: Effect.gen(function* () {
      const db = yield* IDB;

      return {
        create: (args: CreateEventArgs) =>
          Effect.gen(function* () {
            return (yield* db.insert(eventTable).values(args).returning())[0]!;
          }),
      };
    }),
  },
) {}
