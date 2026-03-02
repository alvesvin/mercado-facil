import { getConnInfo } from "hono/bun";
import type { TimingVariables } from "hono/timing";
import type { auth } from "@/ports/trpc/auth";
import { ResultAsync } from "neverthrow";
import type { Effect } from "effect";
import type { UnauthorizedError } from "@/domain/errors";

type ConnInfo = ReturnType<typeof getConnInfo>;

export type WideEvent = {
  id: string;
  ts: number;
  connInfo: ConnInfo;
  auth?: AuthType;
  request: {
    url: {
      host: string;
      hostname: string;
      protocol: string;
      pathname: string;
      search: Record<string, string | string[]>;
    };
    ua: string;
  };
  response?: {
    status: number;
  };
  metric?: {
    headers: string[];
  };
  sampling: number;
  sampled: boolean;
};

export type State = {
  Variables: TimingVariables & {
    event: WideEvent;
    auth: Effect.Effect<AuthType, UnauthorizedError>;
  };
};

export type AuthType = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
};
