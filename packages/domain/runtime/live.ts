import { ManagedRuntime, pipe } from "effect";
import { Layer } from "effect";
import { CartService } from "../features/cart/CartService";
import { EventService } from "../features/event/EventService";
import { CartRepository } from "../features/cart/CartRepository";
import { EventRepository } from "../features/event/EventRepository";
import { DB } from "@mercado-facil/db/service";
import { StoreService } from "../features/store/StoreService";
import { StoreRepository } from "../features/store/StoreRepository";

export const LiveRuntime = ManagedRuntime.make(
  pipe(
    Layer.mergeAll(
      CartService.Default,
      EventService.Default,
      StoreService.Default,
    ),
    Layer.provide(
      Layer.mergeAll(
        CartRepository.Default,
        EventRepository.Default,
        StoreRepository.Default,
      ),
    ),
    Layer.provide(DB),
  ),
);
