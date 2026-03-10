import type { Db } from "@mercado-facil/db";
import { err, ok } from "neverthrow";
import { CreatePriceForProductTodayError, TooManyPricesForStoreTodayError } from "../errors";
import { PriceRepository } from "../PriceRepository";
import type { CreatePriceArgs } from "../types";

export class CanUserCreatePriceSpec {
  constructor(private readonly priceRepository: PriceRepository) {}

  static withTransaction(db: Db) {
    return new CanUserCreatePriceSpec(PriceRepository.withTransaction(db));
  }

  check(args: CreatePriceArgs & { userId: string }) {
    return this.priceRepository
      .findCreatedByUserIdToday(args.userId)
      .andThen((pricesCreatedToday) => {
        // Users should not be able to create a price for the same product in the same store for the same date and type
        if (
          pricesCreatedToday.find(
            (price) =>
              price.storeId === args.storeId &&
              price.productId === args.productId &&
              price.type === args.type,
          )
        ) {
          return err(new CreatePriceForProductTodayError());
        }

        // Users should not be able to create prices for more than 10 stores in the same date
        if (new Set(pricesCreatedToday.map((price) => price.storeId)).size >= 10) {
          return err(new TooManyPricesForStoreTodayError());
        }

        return ok(true);
      });
  }
}
