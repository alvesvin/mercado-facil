import { Effect } from "effect";
import { EventRepository } from "./EventRepository";
import type { CreateEventArgs } from "./types";

export class EventService extends Effect.Service<EventService>()(
  "EventService",
  {
    effect: Effect.gen(function* () {
      const eventRepository = yield* EventRepository;

      return {
        create: eventRepository.create.bind(eventRepository),
      };
    }),
  },
) {}
