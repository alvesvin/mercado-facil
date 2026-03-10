import * as Sentry from "@mercado-facil/sentry";
import { randomUUIDv7 } from "bun";
import { t } from "../init";

type Primitive = string | number | boolean | null | undefined;

export const sentryMiddleware = t.middleware(async ({ next, ctx, ...opts }) => {
  const eventId = randomUUIDv7();

  const event: Record<string, Primitive> = {
    "request.id": eventId,
    "trpc.path": opts.path,
    "trpc.batchIndex": opts.batchIndex,
    "user.id": ctx.auth?.user?.id,
    "user.email": ctx.auth?.user?.email,
    "user.isAnonymous": ctx.auth?.user?.isAnonymous,
    "session.id": ctx.auth?.session?.id,
  };

  Sentry.setTags(event);

  // Isolation scope - unique per request
  Sentry.getIsolationScope().setAttributes(event);

  const response = await next({ ctx: { event } });

  if (!response.ok) {
    let tag = "Uncategorized";
    if (
      response.error.cause &&
      "tag" in response.error.cause &&
      typeof response.error.cause.tag === "string"
    ) {
      tag = response.error.cause.tag;
    } else if (
      response.error &&
      "tag" in response.error &&
      typeof response.error.tag === "string"
    ) {
      tag = response.error.tag;
    }

    Sentry.captureException(response.error.cause ?? response.error, {
      tags: { "error.tag": tag },
    });
  }

  return response;
});
