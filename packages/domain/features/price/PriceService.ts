import { Effect } from "effect";
import { PriceRepository } from "./PriceRepository";
import type { FindConsensusArgs } from "./types";

/**
 * Compute median of sorted numeric array
 */
function median(sorted: number[]): number {
  const n = sorted.length;
  const mid = Math.floor(n / 2);

  if (n % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}

/**
 * Compute percentile (0-100)
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;

  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return sorted[lower];
  }

  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
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

export class PriceService extends Effect.Service<PriceService>()("PriceService", {
  effect: Effect.gen(function* () {
    const priceRepository = yield* PriceRepository;

    return {
      create: priceRepository.create.bind(priceRepository),

      findConsensus: (args: FindConsensusArgs) =>
        Effect.gen(function* () {
          const [unitPrices, perKgPrices, perLPrices] = yield* Effect.all([
            priceRepository.search({
              filters: { ...args, type: "unit" },
              pagination: { limit: 20, page: 1 },
            }),
            priceRepository.search({
              filters: { ...args, type: "per_kg" },
              pagination: { limit: 20, page: 1 },
            }),
            priceRepository.search({
              filters: { ...args, type: "per_l" },
              pagination: { limit: 20, page: 1 },
            }),
          ]);

          const getConsensus = (prices: typeof unitPrices) => {
            const priceNumbers = prices.map((price) => price.price);
            const filteredPrices = removeOutliers(priceNumbers);
            const consensusPrice = median(filteredPrices);
            const price = prices.find((price) => price.price === consensusPrice);
            return price;
          };

          const unitConsensus = getConsensus(unitPrices);
          const perKgConsensus = getConsensus(perKgPrices);
          const perLConsensus = getConsensus(perLPrices);

          return {
            unit: unitConsensus,
            per_kg: perKgConsensus,
            per_l: perLConsensus,
          };
        }),
    };
  }),
}) {}
