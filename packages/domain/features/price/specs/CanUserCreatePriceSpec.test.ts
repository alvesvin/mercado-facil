import { beforeEach, describe, expect, it } from "bun:test";
import { okAsync } from "neverthrow";
import { type MockClass, mockClass } from "../../../tests/utils";
import { unwrapAsync } from "../../../utils";
import { CreatePriceForProductTodayError, TooManyPricesForStoreTodayError } from "../errors";
import type { PriceRepository } from "../PriceRepository";
import { CanUserCreatePriceSpec } from "./CanUserCreatePriceSpec";

describe("CanUserCreatePriceSpec", () => {
  let spec: CanUserCreatePriceSpec;
  let repo: MockClass<PriceRepository>;

  beforeEach(() => {
    repo = mockClass<PriceRepository>();
    spec = new CanUserCreatePriceSpec(repo);
  });

  it("should return true if the user has not created any prices today", () => {
    repo.findCreatedByUserIdToday.mockReturnValue(okAsync([]));
    expect(unwrapAsync(spec.check({} as never))).resolves.toBe(true);
  });

  it("should throw an error if user created price to the same product, same store, same date and same type", () => {
    const price = {
      productId: "123",
      storeId: "123",
      type: "unit" as const,
      price: 10,
      currency: "BRL",
      userId: "123",
    };
    repo.findCreatedByUserIdToday.mockReturnValue(okAsync([price]));
    return expect(unwrapAsync(spec.check(price))).rejects.toThrow(CreatePriceForProductTodayError);
  });

  it("should throw an error if user created prices for 10 stores in same date", () => {
    const prices = Array.from({ length: 10 }, () => ({ storeId: Math.random().toString() }));
    repo.findCreatedByUserIdToday.mockReturnValue(okAsync(prices));
    return expect(
      unwrapAsync(spec.check({ productId: "123", userId: "123" } as never)),
    ).rejects.toThrow(TooManyPricesForStoreTodayError);
  });

  it("should allow create to the 10th store in same date", () => {
    const prices = Array.from({ length: 9 }, () => ({ storeId: Math.random().toString() }));
    repo.findCreatedByUserIdToday.mockReturnValue(okAsync(prices));
    return expect(
      unwrapAsync(spec.check({ productId: "123", userId: "123" } as never)),
    ).resolves.toBe(true);
  });
});
