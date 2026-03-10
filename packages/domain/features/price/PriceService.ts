import type { Db } from "@mercado-facil/db";
import { okAsync, ResultAsync } from "neverthrow";
import type { Context } from "../../types";
import { PriceRepository } from "./PriceRepository";
import type { CreatePriceArgs, FindConsensusArgs } from "./types";

/**
 * Compute median of sorted numeric array
 */
function median(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return 0;

  const mid = Math.floor(n / 2);

  if (n % 2 === 0) {
    const left = sorted[mid - 1];
    const right = sorted[mid];
    if (left === undefined || right === undefined) return 0;
    return (left + right) / 2;
  }

  return sorted[mid] ?? 0;
}

/**
 * Compute percentile (0-100)
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;

  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const lowerValue = sorted[lower];

  if (lowerValue === undefined) return 0;

  if (lower === upper) {
    return lowerValue;
  }

  const upperValue = sorted[upper];
  if (upperValue === undefined) return lowerValue;

  const weight = index - lower;
  return lowerValue * (1 - weight) + upperValue * weight;
}

/**
 * Remove outliers using IQR method
 */
function removeOutliers(prices: number[]): number[] {
  if (prices.length < 4) return prices; // not enough data for IQR

  const sorted = [...prices].sort((a, b) => a - b);

  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;

  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return sorted.filter((p) => p >= lowerBound && p <= upperBound);
}

export class PriceService {
  constructor(private readonly priceRepository: PriceRepository) {}

  withTransaction(db: Db) {
    return new PriceService(new PriceRepository(db));
  }

  create(args: Omit<CreatePriceArgs, "userId">, ctx: Context) {
    const { user } = ctx.auth;
    return this.priceRepository.create({
      ...args,
      userId: user.id,
    });
  }

  findConsensus(args: FindConsensusArgs) {
    const getConsensus = (
      prices: { id: string; price: number; currency: string; type: "unit" | "per_kg" | "per_l" }[],
    ) => {
      const priceNumbers = prices.map((price) => price.price);
      const filteredPrices = removeOutliers(priceNumbers);
      const consensusPrice = median(filteredPrices);
      const price = prices.find((price) => price.price === consensusPrice);
      return price;
    };

    return ResultAsync.combine([
      this.priceRepository.search({
        filters: { ...args, type: "unit" },
        pagination: { limit: 20, page: 1 },
      }),
      this.priceRepository.search({
        filters: { ...args, type: "per_kg" },
        pagination: { limit: 20, page: 1 },
      }),
      this.priceRepository.search({
        filters: { ...args, type: "per_l" },
        pagination: { limit: 20, page: 1 },
      }),
    ])
      .map(([unitPrices, perKgPrices, perLPrices]) => [
        getConsensus(unitPrices),
        getConsensus(perKgPrices),
        getConsensus(perLPrices),
      ])
      .map(([unitConsensus, perKgConsensus, perLConsensus]) => ({
        unit: unitConsensus,
        per_kg: perKgConsensus,
        per_l: perLConsensus,
      }))
      .orElse(() =>
        okAsync({
          unit: undefined,
          per_kg: undefined,
          per_l: undefined,
        }),
      );
  }
}
