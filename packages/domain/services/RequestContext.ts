import type { UnauthorizedError } from "@mercado-facil/errors";
import { Effect } from "effect";
import type { Auth } from "../features/auth/types";

export type RequestContextArgs = {
  auth: Effect.Effect<Auth, UnauthorizedError>;
};

export class RequestContext extends Effect.Service<RequestContext>()("RequestContext", {
  effect: (args: RequestContextArgs) =>
    Effect.gen(function* () {
      return yield* Effect.succeed(args);
    }),
}) {}
