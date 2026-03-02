import { Effect } from "effect";
import { ProductService } from "../services/product";

export const createProduct = () => Effect.gen(function* () {
    const productService = yield* ProductService;
    productService.create();
})
