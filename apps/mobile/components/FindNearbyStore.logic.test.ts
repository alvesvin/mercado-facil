import {
  handleCartAlreadySet,
  handleConfirmStore,
  handleStoreNotFound,
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
