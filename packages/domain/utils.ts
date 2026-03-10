import type { DrizzleQueryError } from "drizzle-orm";
import { type Result, ResultAsync } from "neverthrow";

export function wrap<T>(promise: Promise<T>) {
  return ResultAsync.fromPromise(promise, (error) => error as DrizzleQueryError);
}

export function unwrap<T, E>(result: Result<T, E>): T {
  return result.match(
    (value) => value,
    (error) => {
      throw error;
    },
  );
}

export function unwrapAsync<T, E>(result: ResultAsync<T, E>): Promise<T> {
  return result.match(
    (value) => value,
    (error) => {
      throw error;
    },
  );
}
