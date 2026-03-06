import type { ImagePickerAsset } from "expo-image-picker";
import * as Location from "expo-location";
import { assign, fromPromise, setup } from "xstate";
import { api } from "@/lib/api";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

type Context = {
  cart: { id: string } | null;
  store: { id: string; name: string; city: string | null; address: string | null } | null;
  price: {
    value: number;
    currency: string;
    type: "unit" | "per_kg" | "per_l";
  } | null;
  price2: {
    value: number;
    currency: string;
    type: "unit" | "per_kg" | "per_l";
  } | null;
  product: {
    id: string;
    isNew?: boolean;
    name?: string;
    brand?: string | null;
    flavor?: string | null;
    quantityUnit?: "unit" | "kg" | "g" | "mg" | "lb" | "oz" | "ml" | "l" | "gal" | null;
    quantity?: number | null;
    category?: string | null;
    subCategory?: string | null;
  };
  barcode: string | null;
  photo: ImagePickerAsset | null;
};

export const scanProductMachine = setup({
  types: {
    context: {} as Context,
    events: {} as
      | { type: "scan.scanned"; barcode: string }
      | { type: "store.confirm" }
      | { type: "store.reject" }
      | { type: "product.photo.taken"; photo: ImagePickerAsset }
      | { type: "product.register.new"; product: Omit<Context["product"], "id"> }
      | {
          type: "product.price.confirmed";
          price: { value: number; currency: string; type: "unit" | "per_kg" | "per_l" };
        },
  },
  actors: {
    getActiveCart: fromPromise(async () => await api.cart.start.mutate()),

    findNearByStore: fromPromise(async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) return null;
      const _location = await Location.getCurrentPositionAsync();
      return await api.store.findNear.query({
        latitude: -21.15538058563684,
        longitude: -48.98460169174946,
      });
    }),

    updateCartStore: fromPromise(
      async ({ input }: { input: { storeId: string; cartId: string } }) => {
        return await api.cart.updateStore.mutate({
          cart: { id: input.cartId },
          store: { id: input.storeId },
        });
      },
    ),

    findByBarcode: fromPromise(
      async ({ input }: { input: { barcode: string; storeId: string } }) => {
        return await api.product.findWithPriceByBarcodeSaga.query({
          barcode: input.barcode,
          storeId: input.storeId,
        });
      },
    ),

    generateAIInfo: fromPromise(async ({ input }: { input: { photo: ImagePickerAsset } }) => {
      return await api.ai.generateProductInfo.mutate({
        images: [
          {
            base64: input.photo.base64!,
            mime: input.photo.mimeType || "image/jpeg",
          },
        ],
      });
    }),

    registerNewProduct: fromPromise(async ({ input }: { input: Context }) => {
      return await api.cart.reigsterNewProductSaga.mutate({
        cartId: input.cart!.id,
        storeId: input.store!.id,
        price: {
          ...input.price!,
          value: input.price!.value,
        },
        media: {
          base64: input.photo!.base64!,
          mimeType: input.photo!.mimeType || "image/jpeg",
        },
        product: {
          barcode: input.barcode!,
          name: input.product.name!,
          brand: input.product.brand!,
          quantity: input.product.quantity!,
          quantityUnit: input.product.quantityUnit!,
          flavor: input.product.flavor!,
          category: input.product.category!,
          subCategory: input.product.subCategory!,
        },
      });
    }),
  },
}).createMachine({
  id: "cart-scan",
  initial: "cart",
  context: {
    price: null,
    price2: null,
    cart: null,
    store: null,
    barcode: null,
    product: { id: uuidv4(), isNew: true },
    photo: null,
  },
  states: {
    cart: {
      invoke: {
        src: "getActiveCart",
        onDone: [
          {
            guard: ({ event }) => !event.output.storeId,
            actions: assign({ cart: ({ event }) => event.output }),
            target: "findNearByStore",
          },
          {
            guard: ({ event }) => !!event.output.storeId !== null,
            actions: assign({
              cart: ({ event }) => event.output,
              store: ({ event }) => ({ id: event.output.storeId! }),
            }),
            target: "scan",
          },
        ],
      },
    },
    findNearByStore: {
      invoke: {
        src: "findNearByStore",
        onDone: [
          {
            guard: ({ event }) => event.output === null,
            target: "newStore",
          },
          {
            guard: ({ event }) => event.output !== null,
            target: "confirmStore",
            actions: assign({ store: ({ event }) => event.output }),
          },
        ],
      },
    },
    confirmStore: {
      on: {
        "store.confirm": { target: "updateCartStore" },
        "store.reject": { target: "newStore" },
      },
    },
    updateCartStore: {
      invoke: {
        src: "updateCartStore",
        input: ({ context }) => ({ storeId: context.store!.id, cartId: context.cart!.id }),
        onDone: {
          target: "scan",
        },
      },
    },
    newStore: {},
    scan: {
      on: {
        "scan.scanned": {
          target: "findByBarcode",
          actions: assign({ barcode: ({ event }) => event.barcode }),
        },
      },
    },
    findByBarcode: {
      invoke: {
        src: "findByBarcode",
        input: ({ context }) => ({ barcode: context.barcode!, storeId: context.store!.id }),
        onDone: [
          {
            guard: ({ event }) => !event.output,
            target: "takeProductPhoto",
          },
          {
            guard: ({ event }) => !!event.output,
            target: "confirmPrice",
            actions: assign({
              product: ({ event }) => event.output!.product,
              price: ({ event }) => ({
                value: event.output!.price.price,
                currency: "BRL",
                type: "unit",
              }),
            }),
          },
        ],
      },
    },
    takeProductPhoto: {
      on: {
        "product.photo.taken": {
          target: "generateAIInfo",
          actions: assign({ photo: ({ event }) => event.photo }),
        },
        "product.photo.canceled": {
          target: "scan",
        },
      },
    },
    generateAIInfo: {
      invoke: {
        src: "generateAIInfo",
        input: ({ context }) => ({ photo: context.photo! }),
        onDone: [
          {
            guard: ({ event }) => !event.output,
            target: "newProductForm",
          },
          {
            guard: ({ event }) =>
              !!event.output && (!event.output.quantity || !event.output.quantityUnit),
            actions: assign({
              product: ({ event, context }) => ({ ...context.product, ...event.output }),
            }),
            target: "newProductForm",
          },
          {
            guard: ({ event }) => !!event.output,
            target: "confirmPrice",
            actions: assign({
              product: ({ event, context }) => ({ ...context.product, ...event.output }),
            }),
          },
        ],
      },
    },
    newProductForm: {
      on: {
        "product.register.new": {
          target: "confirmPrice",
          actions: assign({
            product: ({ event, context }) => ({ ...context.product, ...event.product }),
          }),
        },
      },
    },
    confirmPrice: {
      on: {
        "product.price.confirmed": [
          {
            guard: ({ context }) => !!context.product.isNew,
            actions: assign({ price: ({ event }) => event.price }),
            target: "registerNewProduct",
          },
          {
            guard: ({ context }) => !context.product.isNew,
            actions: assign({ price2: ({ event }) => event.price }),
            target: "registerExistingProduct",
          },
        ],
      },
    },
    registerNewProduct: {
      invoke: {
        src: "registerNewProduct",
        input: ({ context }) => context,
        onDone: {
          target: "final",
        },
      },
    },
    registerExistingProduct: {},
    final: {},
  },
});
