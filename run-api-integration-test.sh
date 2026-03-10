#!/bin/sh
docker compose -f docker-compose.api-test.yml run --build --rm api bun --filter=@mercado-facil/db db:push
docker compose -f docker-compose.api-test.yml run --rm api bun --filter=@mercado-facil/trpc run test