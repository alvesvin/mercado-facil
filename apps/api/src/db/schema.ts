import { and, isNull, sql } from "drizzle-orm";
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

export const event = pgTable("event", {
  id: uuid("id").primaryKey(),
  ts: bigint("ts", { mode: "number" }).notNull(),
  data: jsonb("data").notNull(),
});

export const user = pgTable("user", {
  ...COMMON_FIELDS,
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  isAnonymous: boolean("is_anonymous").notNull(),
});

export const session = pgTable(
  "session",
  {
    ...COMMON_FIELDS,
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    ...COMMON_FIELDS,
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
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

export const verification = pgTable(
  "verification",
  {
    ...COMMON_FIELDS,
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const store = pgTable("store", {
  ...COMMON_FIELDS,
  name: text("name").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  country: text("country"),
  phone: text("phone"),
  email: text("email"),
});

export const brand = pgTable("brand", {
  ...COMMON_FIELDS,
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
});

export const product = pgTable("product", {
  ...COMMON_FIELDS,
  barcode: text("barcode").notNull(),
  name: text("name").notNull(),
  brand: text("brand").references(() => brand.id, { onDelete: "set null" }),
  category: text("category"),
  subCategory: text("sub_category"),
  description: text("description"),
});

export const price = pgTable("price", {
  ...COMMON_FIELDS,
  userId: uuid("user_id").references(() => user.id, { onDelete: "set null" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  storeId: uuid("store_id").references(() => store.id, {
    onDelete: "set null",
  }),
  price: bigint("price", { mode: "number" }).notNull(),
  currency: text("currency").notNull().default("BRL"),
});

export const cart = pgTable(
  "cart",
  {
    ...COMMON_FIELDS,
    storeId: uuid("store_id").references(() => store.id, {
      onDelete: "set null",
    }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("latest_cart_user_id_idx")
      .on(table.userId, table.createdAt.desc())
      .where(sql`${table.deletedAt} IS NULL AND ${table.completedAt} IS NULL`),
  ],
);

export const cartItem = pgTable("cart_item", {
  ...COMMON_FIELDS,
  cartId: uuid("cart_id")
    .notNull()
    .references(() => cart.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  completedAt: timestamp("completed_at"),
});
