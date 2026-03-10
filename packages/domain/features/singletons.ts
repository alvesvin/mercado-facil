import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { db } from "@mercado-facil/db";
import { getSupabaseServerClient } from "@mercado-facil/supabase/server";
import { AiService } from "./ai/AiService";
import { BlobService } from "./blob/BlobService";
import { BrandRepository } from "./brand/BrandRepository";
import { BrandService } from "./brand/BrandService";
import { CartItemRepository } from "./cart/CartItemRepository";
import { CartRepository } from "./cart/CartRepository";
import { CartService } from "./cart/CartService";
import { EventRepository } from "./event/EventRepository";
import { EventService } from "./event/EventService";
import { PriceRepository } from "./price/PriceRepository";
import { PriceService } from "./price/PriceService";
import { ProductMediaRepository } from "./product/ProductMediaRepository";
import { ProductMediaService } from "./product/ProductMediaService";
import { ProductRepository } from "./product/ProductRepository";
import { ProductService } from "./product/ProductService";
import { StoreRepository } from "./store/StoreRepository";
import { StoreService } from "./store/StoreService";

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });
export const aiService = new AiService(google);

const supabase = getSupabaseServerClient();
export const blobService = new BlobService(supabase);

export const brandRepository = new BrandRepository(db);
export const brandService = new BrandService(brandRepository);

export const priceRepository = new PriceRepository(db);
export const priceService = new PriceService(priceRepository);

export const eventRepository = new EventRepository(db);
export const eventService = new EventService(eventRepository);

export const cartRepository = new CartRepository(db);
export const cartItemRepository = new CartItemRepository(db);
export const cartService = new CartService(cartRepository, cartItemRepository);

export const productRepository = new ProductRepository(db);
export const productService = new ProductService(productRepository);
export const productMediaRepository = new ProductMediaRepository(db);
export const productMediaService = new ProductMediaService(productMediaRepository);

export const storeRepository = new StoreRepository(db);
export const storeService = new StoreService(storeRepository);
