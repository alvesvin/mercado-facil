import { ManagedRuntime, pipe } from "effect";
import { Layer } from "effect";
import { CartService } from "../features/cart/CartService";
import { EventService } from "../features/event/EventService";
import { CartRepository } from "../features/cart/CartRepository";
import { EventRepository } from "../features/event/EventRepository";
import { DB } from "@mercado-facil/db/service";
import { StoreService } from "../features/store/StoreService";
import { StoreRepository } from "../features/store/StoreRepository";
import { ProductService } from "../features/product/ProductService";
import { ProductRepository } from "../features/product/ProductRepository";
import { AiService } from "../features/ai/AiService";
import { PriceService } from "../features/price/PriceService";
import { PriceRepository } from "../features/price/PriceRepository";
import { BrandService } from "../features/brand/BrandService";
import { BrandRepository } from "../features/brand/BrandRepository";

export const LiveRuntime = ManagedRuntime.make(
  pipe(
    Layer.mergeAll(
      CartService.Default,
      EventService.Default,
      StoreService.Default,
      ProductService.Default,
      AiService.Default,
      PriceService.Default,
      BrandService.Default,
    ),
    Layer.provide(
      Layer.mergeAll(
        CartRepository.Default,
        EventRepository.Default,
        StoreRepository.Default,
        ProductRepository.Default,
        PriceRepository.Default,
        BrandRepository.Default,
      ),
    ),
  ),
);
