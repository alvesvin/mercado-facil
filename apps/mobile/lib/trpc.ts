import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@mercado-facil/trpc/router';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
