import type { InferInsertModel } from "drizzle-orm";
import { eventTable } from "@mercado-facil/db/schema";

type SerializableValue = string | number | boolean | null | SerializableObject;

interface SerializableObject {
  [key: string]: SerializableValue | SerializableObject[];
}

export type CreateEventArgs = InferInsertModel<typeof eventTable> & {
  data: SerializableObject;
};
