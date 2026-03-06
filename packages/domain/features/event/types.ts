import type { eventTable } from "@mercado-facil/db/schema";
import type { InferInsertModel } from "drizzle-orm";

type SerializableValue = string | number | boolean | null | SerializableObject;

interface SerializableObject {
  [key: string]: SerializableValue | SerializableObject[];
}

export type CreateEventArgs = InferInsertModel<typeof eventTable> & {
  data: SerializableObject;
};
