import type { Db } from "@mercado-facil/db";
import { eventTable } from "@mercado-facil/db/schema";
import { ok } from "neverthrow";
import { wrap } from "../../utils";
import type { CreateEventArgs } from "./types";

export class EventRepository {
  constructor(private readonly db: Db) {}

  create(args: CreateEventArgs) {
    return wrap(this.db.insert(eventTable).values(args).returning()).andThen(([event]) =>
      ok(event!),
    );
  }
}
