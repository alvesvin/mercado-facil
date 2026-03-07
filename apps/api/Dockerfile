FROM oven/bun:1 AS base
# Set working directory
WORKDIR /app

# ---
FROM base AS prepare
RUN bun add -g turbo@^2
COPY . .
# Add lockfile and package.json's of isolated subworkspace
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune @mercado-facil/api

# ---
FROM base AS deps
WORKDIR /app
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/ .
RUN bun install --production

# ---
FROM base AS runner
ARG PORT=3000
WORKDIR /app
COPY --from=deps /app/ .

# Don't run production as root for security reasons
USER bun
EXPOSE ${PORT}/tcp

CMD ["bun", "run", "--filter=@mercado-facil/api", "start"]