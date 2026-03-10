#!/bin/bash

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

# Create the 'template_postgis' template db
"${psql[@]}" <<- 'EOSQL'
CREATE DATABASE template_postgis IS_TEMPLATE true;
EOSQL

# Load PostGIS into both template_database and $POSTGRES_DB
for DB in template_postgis "$POSTGRES_DB"; do
	echo "Loading PostGIS extensions into $DB"
	"${psql[@]}" --dbname="$DB" -c "ALTER DATABASE \"$DB\" SET search_path TO public, extensions;"
	"${psql[@]}" --dbname="$DB" <<-'EOSQL'
		CREATE SCHEMA IF NOT EXISTS extensions;
		CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;
		CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;
EOSQL
done