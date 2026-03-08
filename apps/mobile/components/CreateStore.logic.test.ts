import { handleCancelCreateStore, handleCreateStore } from "./CreateStore.logic";

describe("handleCreateStore", () => {
  it("should send a STORE_FOUND event", async () => {
    const createStore = jest.fn().mockResolvedValue({ id: "1" });
    const send = jest.fn();
    await handleCreateStore(
      { values: { name: "Test Store" }, latitude: 0, longitude: 0 },
      { createStore, send },
    );
    expect(send).toHaveBeenCalledWith({ type: "STORE_FOUND", store: { id: "1" } });
  });
});

describe("handleCancelCreateStore", () => {
  it("should send a CANCELLED event", () => {
    const send = jest.fn();
    handleCancelCreateStore({ send });
    expect(send).toHaveBeenCalledWith({ type: "CANCELLED" });
  });
});
