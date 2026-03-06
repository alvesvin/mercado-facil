import { EventService } from "@mercado-facil/domain/features/event/EventService";
import { TRPCError } from "@trpc/server";
import type { MiddlewareFunction } from "@trpc/server/unstable-core-do-not-import";
import { Effect, Either } from "effect";

// biome-ignore lint/suspicious/noExplicitAny: workaround
type MiddlewareOptions = Parameters<MiddlewareFunction<any, any, any, any, any>>[0];

export const wideEventsMiddleware = (opts: MiddlewareOptions) =>
  Effect.gen(function* () {
    const eventService = yield* EventService;

    const eventId = crypto.randomUUID();
    const ts = Date.now();
    const sampling = 1.0;
    let sampled = Math.random() < sampling;

    const event = {
      id: eventId,
      ts,
      trpc: {
        batchIndex: opts.batchIndex,
        path: opts.path,
        input: opts.input,
        meta: opts.meta,
      },
      sampling,
      sampled,
    };

    const result = yield* Effect.tryPromise(() =>
      opts.next({
        ctx: { event },
      }),
    ).pipe(Effect.either);

    if (Either.isLeft(result)) {
      sampled = true;
    }

    if (sampled) {
      yield* eventService
        .create({
          id: eventId,
          ts,
          data: event,
        })
        .pipe(
          Effect.catchAllCause((cause) => Effect.logError("Failed to create event", cause)),
          Effect.forkDaemon,
        );
    }

    if (Either.isLeft(result)) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: result.left.error,
      });
    } else {
      return result.right;
    }
  });
