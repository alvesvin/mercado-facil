import type { Db } from "@mercado-facil/db";
import { EventRepository } from "./EventRepository";
import type { CreateEventArgs } from "./types";

export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  static withTransaction(db: Db) {
    return new EventService(EventRepository.withTransaction(db));
  }

  create(args: CreateEventArgs) {
    return this.eventRepository.create(args);
  }
}
