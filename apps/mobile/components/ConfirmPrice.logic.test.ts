import {
  handleCancelConfirmPrice,
  handleConfirmPrice,
  shouldCreatePrice,
} from "./ConfirmPrice.logic";

describe("shouldCreatePrice", () => {
  it("should return false if the product is new", () => {
    const result = shouldCreatePrice({
      product: { isNew: true },
      prices: { unit: { id: "1", price: 10 } },
      value: 10,
    });
    expect(result).toBe(false);
  });

  it("should return false if the product is not new and the price is the same", () => {
    const result = shouldCreatePrice({
      product: { isNew: false },
      prices: { unit: { id: "1", price: 10 } },
      value: 10,
    });
    expect(result).toBe(false);
  });

  it("should return true if the product is not new and the price is different", () => {
    const result = shouldCreatePrice({
      product: { isNew: false },
      prices: { unit: { id: "1", price: 10 } },
      value: 11,
    });
    expect(result).toBe(true);
  });

  it("should return true if price is not set", () => {
    const result = shouldCreatePrice({
      product: { isNew: false },
      prices: { unit: undefined },
      value: 10,
    });
    expect(result).toBe(true);
  });
});

describe("handleCancelConfirmPrice", () => {
  it("should send a PRICE_CANCELLED event", () => {
    const send = jest.fn();
    handleCancelConfirmPrice({ send });
    expect(send).toHaveBeenCalledWith({ type: "PRICE_CANCELLED" });
  });
});

describe("handleConfirmPrice", () => {
  it("should send a PRICE_CONFIRMED event", () => {
    const send = jest.fn();
    const createPrice = jest.fn().mockResolvedValue({ id: "1" });
    handleConfirmPrice(
      {
        value: 10,
        prices: { unit: { id: "1", price: 10 } },
        product: { id: "1", isNew: false },
        cart: { storeId: "1" },
      },
      { createPrice, send },
    );
    expect(send).toHaveBeenCalledWith({
      type: "PRICE_CONFIRMED",
      price: { id: "1", price: 10, currency: "BRL", type: "unit" },
    });
  });
});
