import { publicProcedure, router } from "../trpc";
import { shoppingSessionRouter } from "./shopping-session";

export const appRouter = router({
    shoppingSession: shoppingSessionRouter,
})

export type AppRouter = typeof appRouter;