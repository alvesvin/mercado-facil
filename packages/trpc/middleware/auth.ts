import { UnauthorizedError } from "@mercado-facil/errors";
import * as Sentry from "@mercado-facil/sentry";
import { t } from "../init";

export const authMiddleware = t.middleware(async ({ next, ctx }) => {
  if (!ctx.auth) throw new UnauthorizedError();
  Sentry.setUser({
    id: ctx.auth.user.id,
    email: ctx.auth.user.email,
    ip_address: ctx.auth.session.ipAddress ?? undefined,
    is_anonymous: ctx.auth.user.isAnonymous,
  });
  return next({ ctx: { auth: ctx.auth } });
});
