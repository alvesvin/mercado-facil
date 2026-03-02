import type { InferSelectModel } from 'drizzle-orm'
import { cart } from '../db/schema'

export type Cart = InferSelectModel<typeof cart>