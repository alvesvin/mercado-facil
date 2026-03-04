import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  bigint,
  boolean,
  index,
  jsonb,
  integer,
  varchar,
  check,
  pgView,
  customType,
  geometry,
} from "drizzle-orm/pg-core";

const COMMON_FIELDS = {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
};

export const eventTable = pgTable("event", {
  id: uuid("id").primaryKey(),
  ts: bigint("ts", { mode: "number" }).notNull(),
  data: jsonb("data").notNull(),
});

export const userTable = pgTable("user", {
  ...COMMON_FIELDS,
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  isAnonymous: boolean("is_anonymous").notNull(),
});

export const sessionTable = pgTable(
  "session",
  {
    ...COMMON_FIELDS,
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const accountTable = pgTable(
  "account",
  {
    ...COMMON_FIELDS,
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verificationTable = pgTable(
  "verification",
  {
    ...COMMON_FIELDS,
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const storeTable = pgTable(
  "store",
  {
    ...COMMON_FIELDS,
    name: text("name").notNull(),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    zip: text("zip"),
    country: text("country"),
    location: geometry("location", { type: "point", srid: 4326 }),
    phone: text("phone"),
    email: text("email"),
  },
  (t) => [index("location_index").using("gist", t.location)],
);

export const brandTable = pgTable("brand", {
  ...COMMON_FIELDS,
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
});

export const productTable = pgTable("product", {
  ...COMMON_FIELDS,
  barcode: text("barcode").notNull(),
  name: text("name").notNull(),
  brand: text("brand").references(() => brandTable.id, {
    onDelete: "set null",
  }),
  category: text("category"),
  subCategory: text("sub_category"),
  description: text("description"),
});

export const priceTable = pgTable("price", {
  ...COMMON_FIELDS,
  userId: uuid("user_id").references(() => userTable.id, {
    onDelete: "set null",
  }),
  productId: uuid("product_id")
    .notNull()
    .references(() => productTable.id, { onDelete: "cascade" }),
  storeId: uuid("store_id").references(() => storeTable.id, {
    onDelete: "set null",
  }),
  price: bigint("price", { mode: "number" }).notNull(),
  currency: text("currency").notNull().default("BRL"),
});

export const cartTable = pgTable(
  "cart",
  {
    ...COMMON_FIELDS,
    storeId: uuid("store_id").references(() => storeTable.id, {
      onDelete: "set null",
    }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "set null" }),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("latest_cart_user_id_idx")
      .on(table.userId, table.createdAt.desc())
      .where(sql`${table.deletedAt} IS NULL AND ${table.completedAt} IS NULL`),
  ],
);

export const cartItemTable = pgTable("cart_item", {
  ...COMMON_FIELDS,
  cartId: uuid("cart_id")
    .notNull()
    .references(() => cartTable.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => productTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  completedAt: timestamp("completed_at"),
});

// PostGis
export const spatialRefSys = pgTable(
  "spatial_ref_sys",
  {
    srid: integer().primaryKey(),
    authName: varchar("auth_name", { length: 256 }),
    authSrid: integer("auth_srid"),
    srtext: varchar({ length: 2048 }),
    proj4text: varchar({ length: 2048 }),
  },
  (table) => [
    check("spatial_ref_sys_srid_check", sql`((srid > 0) AND (srid <= 998999))`),
  ],
);
export const geographyColumns = pgView("geography_columns", {
  fTableCatalog: customType({ dataType: () => "name" })("f_table_catalog"),
  fTableSchema: customType({ dataType: () => "name" })("f_table_schema"),
  fTableName: customType({ dataType: () => "name" })("f_table_name"),
  fGeographyColumn: customType({ dataType: () => "name" })(
    "f_geography_column",
  ),
  coordDimension: integer("coord_dimension"),
  srid: integer(),
  type: text(),
}).as(
  sql`SELECT current_database() AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geography_column, postgis_typmod_dims(a.atttypmod) AS coord_dimension, postgis_typmod_srid(a.atttypmod) AS srid, postgis_typmod_type(a.atttypmod) AS type FROM pg_class c, pg_attribute a, pg_type t, pg_namespace n WHERE t.typname = 'geography'::name AND a.attisdropped = false AND a.atttypid = t.oid AND a.attrelid = c.oid AND c.relnamespace = n.oid AND (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text)`,
);

export const geometryColumns = pgView("geometry_columns", {
  fTableCatalog: varchar("f_table_catalog", { length: 256 }),
  fTableSchema: customType({ dataType: () => "name" })("f_table_schema"),
  fTableName: customType({ dataType: () => "name" })("f_table_name"),
  fGeometryColumn: customType({ dataType: () => "name" })("f_geometry_column"),
  coordDimension: integer("coord_dimension"),
  srid: integer(),
  type: varchar({ length: 30 }),
}).as(
  sql`SELECT current_database()::character varying(256) AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geometry_column, COALESCE(postgis_typmod_dims(a.atttypmod), sn.ndims, 2) AS coord_dimension, COALESCE(NULLIF(postgis_typmod_srid(a.atttypmod), 0), sr.srid, 0) AS srid, replace(replace(COALESCE(NULLIF(upper(postgis_typmod_type(a.atttypmod)), 'GEOMETRY'::text), st.type, 'GEOMETRY'::text), 'ZM'::text, ''::text), 'Z'::text, ''::text)::character varying(30) AS type FROM pg_class c JOIN pg_attribute a ON a.attrelid = c.oid AND NOT a.attisdropped JOIN pg_namespace n ON c.relnamespace = n.oid JOIN pg_type t ON a.atttypid = t.oid LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'geometrytype\(\w+\)\s*=\s*''(\w+)'''::text, 'i'::text))[1] AS type FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'geometrytype\(\w+\)\s*=\s*''\w+'''::text) st ON st.connamespace = n.oid AND st.conrelid = c.oid AND (a.attnum = ANY (st.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'ndims\(\w+\)\s*=\s*(\d+)'::text, 'i'::text))[1]::integer AS ndims FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'ndims\(\w+\)\s*=\s*\d+'::text) sn ON sn.connamespace = n.oid AND sn.conrelid = c.oid AND (a.attnum = ANY (sn.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'srid\(\w+\)\s*=\s*(\d+)'::text, 'i'::text))[1]::integer AS srid FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'srid\(\w+\)\s*=\s*\d+'::text) sr ON sr.connamespace = n.oid AND sr.conrelid = c.oid AND (a.attnum = ANY (sr.conkey)) WHERE (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT c.relname = 'raster_columns'::name AND t.typname = 'geometry'::name AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text)`,
);
