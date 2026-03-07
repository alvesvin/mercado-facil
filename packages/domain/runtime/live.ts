import { Layer, ManagedRuntime, pipe } from "effect";
import { AiService } from "../features/ai/AiService";
import { BlobService } from "../features/blob/BlobService";
import { BrandRepository } from "../features/brand/BrandRepository";
import { BrandService } from "../features/brand/BrandService";
import { CartItemRepository } from "../features/cart/CartItemRepository";
import { CartRepository } from "../features/cart/CartRepository";
import { CartService } from "../features/cart/CartService";
import { EventRepository } from "../features/event/EventRepository";
import { EventService } from "../features/event/EventService";
import { PriceRepository } from "../features/price/PriceRepository";
import { PriceService } from "../features/price/PriceService";
import { ProductMediaRepository } from "../features/product/ProductMediaRepository";
import { ProductMediaService } from "../features/product/ProductMediaService";
import { ProductRepository } from "../features/product/ProductRepository";
import { ProductService } from "../features/product/ProductService";
import { StoreRepository } from "../features/store/StoreRepository";
import { StoreService } from "../features/store/StoreService";

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
      BlobService.Default,
      ProductMediaService.Default,
    ),
    Layer.provide(
      Layer.mergeAll(
        CartRepository.Default,
        EventRepository.Default,
        StoreRepository.Default,
        ProductRepository.Default,
        PriceRepository.Default,
        BrandRepository.Default,
        ProductMediaRepository.Default,
        CartItemRepository.Default,
      ),
    ),
  ),
);
