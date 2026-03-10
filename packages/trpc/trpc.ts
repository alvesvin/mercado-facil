import { t } from "./init";
import { authMiddleware } from "./middleware/auth";
import { sentryMiddleware } from "./middleware/sentry";

export const procedure = t.procedure.use(authMiddleware).use(sentryMiddleware);
export const router = t.router;
