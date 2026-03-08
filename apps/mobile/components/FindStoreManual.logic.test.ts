import {
  handleNotFound,
  handleSelectStore,
  shouldFetchStores,
  shouldShowNotFoundButton,
} from "./FindStoreManual.logic";

describe("shouldFetchStores", () => {
  it("should return true if the search not empty and has location", () => {
    const result = shouldFetchStores("1", true);
    expect(result).toBe(true);
  });

  it("should return false if the search is empty", () => {
    const result = shouldFetchStores("", true);
    expect(result).toBe(false);
  });

  it("should return false if the location is not available", () => {
    const result = shouldFetchStores("123", false);
    expect(result).toBe(false);
  });
});

describe("shouldShowNotFoundButton", () => {
  it("should return true if the search is not empty and is not loading", () => {
    const result = shouldShowNotFoundButton({
      search: "1",
      selectingStoreId: "",
      isLoading: false,
    });
    expect(result).toBe(true);
  });

  it("should return false if selecting store", () => {
    const result = shouldShowNotFoundButton({
      search: "123",
      selectingStoreId: "1",
      isLoading: false,
    });
    expect(result).toBe(false);
  });

  it("should return false if the search is empty", () => {
    const result = shouldShowNotFoundButton({
      search: "",
      selectingStoreId: "",
      isLoading: false,
    });
    expect(result).toBe(false);
  });

  it("should return false if the search is not empty and is loading", () => {
    const result = shouldShowNotFoundButton({
      search: "1",
      selectingStoreId: "",
      isLoading: true,
    });
    expect(result).toBe(false);
  });
});

describe("handleNotFound", () => {
  it("should send a STORE_NOT_FOUND event", () => {
    const send = jest.fn();
    handleNotFound({ send });
    expect(send).toHaveBeenCalledWith({ type: "STORE_NOT_FOUND" });
  });
});

describe("handleSelectStore", () => {
  it("should send a STORE_FOUND event", async () => {
    const send = jest.fn();
    const updateCartStore = jest.fn().mockResolvedValue({ id: "1" });
    await handleSelectStore({ storeId: "1", cartId: "1" }, { updateCartStore, send });
    expect(send).toHaveBeenCalledWith({ type: "STORE_FOUND", store: { id: "1" } });
  });

  it("should send a STORE_NOT_FOUND event if the updateCartStore fails", async () => {
    const send = jest.fn();
    const updateCartStore = jest.fn().mockRejectedValue(new Error("Failed to update cart store"));
    await handleSelectStore({ storeId: "1", cartId: "1" }, { updateCartStore, send });
    expect(send).toHaveBeenCalledWith({ type: "STORE_NOT_FOUND" });
  });
});
