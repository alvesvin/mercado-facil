import {
  handleCartAlreadySet,
  handleConfirmStore,
  handleStoreNotFound,
  shouldFetchNearbyStores,
  shouldTriggerStoreNotFoundFromState,
} from "./FindNearbyStore.logic";

describe("handleCartAlreadySet", () => {
  it("should send a STORE_FOUND event", () => {
    const send = jest.fn();
    handleCartAlreadySet({ cart: { storeId: "1" } }, { send });
    expect(send).toHaveBeenCalledWith({ type: "STORE_FOUND", store: { id: "1" } });
  });
});

describe("handleStoreNotFound", () => {
  it("should send a STORE_NOT_FOUND event", () => {
    const send = jest.fn();
    handleStoreNotFound({ send });
    expect(send).toHaveBeenCalledWith({ type: "STORE_NOT_FOUND" });
  });
});

describe("handleConfirmStore", () => {
  it("should send a STORE_FOUND event", async () => {
    const send = jest.fn();
    const updateCartStore = jest.fn().mockResolvedValue({ id: "1" });
    await handleConfirmStore({ cart: { id: "1" }, store: { id: "1" } }, { updateCartStore, send });
    expect(send).toHaveBeenCalledWith({ type: "STORE_FOUND", store: { id: "1" } });
  });
});

describe("shouldFetchNearbyStores", () => {
  it("should return true if the cart store id is null", () => {
    expect(shouldFetchNearbyStores({ storeId: null })).toBe(true);
  });

  it("should return false if the cart store id is not null", () => {
    expect(shouldFetchNearbyStores({ storeId: "1" })).toBe(false);
  });

  it("should return false if the cart not loaded", () => {
    expect(shouldFetchNearbyStores(undefined)).toBe(false);
  });
});

describe("shouldTriggerStoreNotFoundFromState", () => {
  it("should return true if cart loaded and store not found", () => {
    expect(
      shouldTriggerStoreNotFoundFromState({
        cart: { storeId: null },
        store: null,
        isRefetching: false,
      }),
    ).toBe(true);
  });

  it("should return false if cart loaded and store is loading", () => {
    expect(
      shouldTriggerStoreNotFoundFromState({
        cart: { storeId: null },
        store: undefined,
        isRefetching: false,
      }),
    ).toBe(false);
    expect(
      shouldTriggerStoreNotFoundFromState({
        cart: { storeId: null },
        store: null,
        isRefetching: true,
      }),
    ).toBe(false);
  });

  it("should return false if cart not loaded", () => {
    expect(shouldTriggerStoreNotFoundFromState({ cart: undefined, isRefetching: false })).toBe(
      false,
    );
  });
});
