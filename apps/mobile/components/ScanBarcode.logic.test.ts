import type { AudioPlayer } from "expo-audio";
import {
  codeTypes,
  getCanScan,
  handleCancelScanBarcode,
  handleCodeScanned,
  isValidEAN,
  scanBarcodeMachine,
} from "./ScanBarcode.logic";
import { NotificationFeedbackType } from "expo-haptics";
import { createActor } from "xstate";

describe("handleCodeScanned", () => {
  let sideEffects: Parameters<typeof handleCodeScanned>[1];

  beforeEach(() => {
    sideEffects = {
      scanBarcodeEmit: jest.fn(),
      scanWorkflowEmit: jest.fn(),
      haptics: { notificationAsync: jest.fn() },
      beep: { seekTo: jest.fn(), play: jest.fn() } as unknown as AudioPlayer,
      fetchProductByBarcode: jest.fn(),
      isValidEAN: jest.fn(),
    };
  });

  it("should send a CODE_SCANNED event", async () => {
    await handleCodeScanned({ barcode: "1234567890", storeId: "1" }, sideEffects);
    expect(sideEffects.scanBarcodeEmit).toHaveBeenCalledWith({
      type: "CODE_SCANNED",
      barcode: "1234567890",
    });
  });

  it("should send a INVALID event if the barcode is not valid", async () => {
    await handleCodeScanned({ barcode: "1234567890", storeId: "1" }, sideEffects);
    expect(sideEffects.scanBarcodeEmit).toHaveBeenCalledWith({ type: "INVALID" });
  });

  it("should send PRODUCT_FOUND if product is found", async () => {
    sideEffects.fetchProductByBarcode = jest.fn().mockResolvedValue({
      product: { id: "1" },
      prices: { price: 10 },
    });
    sideEffects.isValidEAN = jest.fn().mockReturnValue(true);
    await handleCodeScanned({ barcode: "1234567890", storeId: "1" }, sideEffects);
    expect(sideEffects.scanWorkflowEmit).toHaveBeenCalledWith({
      type: "PRODUCT_FOUND",
      product: { id: "1" },
      prices: { price: 10 },
    });
    expect(sideEffects.haptics.notificationAsync).toHaveBeenCalledWith(
      NotificationFeedbackType.Success,
    );
  });

  it("should send PRODUCT_NOT_FOUND if product is not found", async () => {
    sideEffects.fetchProductByBarcode = jest.fn().mockResolvedValue(null);
    sideEffects.isValidEAN = jest.fn().mockReturnValue(true);
    await handleCodeScanned({ barcode: "1234567890", storeId: "1" }, sideEffects);
    expect(sideEffects.scanWorkflowEmit).toHaveBeenCalledWith({
      type: "PRODUCT_NOT_FOUND",
      barcode: "1234567890",
    });
    expect(sideEffects.haptics.notificationAsync).toHaveBeenCalledWith(
      NotificationFeedbackType.Warning,
    );
  });

  it("should send an ERROR event if an error occurs", async () => {
    sideEffects.fetchProductByBarcode = jest.fn().mockRejectedValue(new Error("Error"));
    sideEffects.isValidEAN = jest.fn().mockReturnValue(true);
    await handleCodeScanned({ barcode: "1234567890", storeId: "1" }, sideEffects);
    expect(sideEffects.haptics.notificationAsync).toHaveBeenCalledWith(
      NotificationFeedbackType.Error,
    );
  });
});

describe("isValidEAN", () => {
  it.each([
    ["valid EAN-13", "4006381333931", true],
    ["valid EAN-8", "55123457", true],
    ["invalid check digit for EAN-13", "4006381333932", false],
    ["invalid check digit for EAN-8", "55123458", false],
    ["non-digit characters", "12345ABC", false],
    ["unsupported length", "1234567", false],
    ["empty string", "", false],
  ])("should return %s", (_, code, expected) => {
    expect(isValidEAN(code)).toBe(expected);
  });
});

describe("getCanScan", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should allow scanning from idle once and block repeated scans during cooldown", () => {
    const canScan = getCanScan();

    expect(canScan("idle")).toBe(true);
    expect(canScan("idle")).toBe(false);
  });

  it("should allow scanning from invalid state", () => {
    const canScan = getCanScan();

    expect(canScan("invalid")).toBe(true);
  });

  it("should block scanning when state is validating", () => {
    const canScan = getCanScan();

    expect(canScan("validating")).toBe(false);
  });

  it("should allow scanning again after the cooldown expires", () => {
    const canScan = getCanScan();

    expect(canScan("idle")).toBe(true);

    jest.advanceTimersByTime(1499);
    expect(canScan("idle")).toBe(false);

    jest.advanceTimersByTime(1);
    expect(canScan("idle")).toBe(true);
  });

  it("should reset the cooldown timer after a new allowed scan", () => {
    const canScan = getCanScan();

    expect(canScan("idle")).toBe(true);

    jest.advanceTimersByTime(1500);
    expect(canScan("invalid")).toBe(true);

    jest.advanceTimersByTime(1499);
    expect(canScan("idle")).toBe(false);

    jest.advanceTimersByTime(1);
    expect(canScan("idle")).toBe(true);
  });
});

describe("codeTypes", () => {
  it("should be an array of CodeType", () => {
    expect(codeTypes).toStrictEqual(["ean-13", "ean-8", "upc-a"]);
  });
});

describe("handleCancelScanBarcode", () => {
  it("should send a CANCELLED event", () => {
    const sideEffects = { send: jest.fn() };
    handleCancelScanBarcode(sideEffects);
    expect(sideEffects.send).toHaveBeenCalledWith({ type: "CANCELLED" });
  });
});

describe("scanBarcodeMachine", () => {
  it("starts in idle", () => {
    const actor = createActor(scanBarcodeMachine);
    expect(actor.getSnapshot().value).toBe("idle");
  });

  it("goes to validating when CODE_SCANNED is received", () => {
    const actor = createActor(scanBarcodeMachine);
    actor.start();
    actor.send({ type: "CODE_SCANNED", barcode: "1234567890" });
    expect(actor.getSnapshot().value).toBe("validating");
  });

  it("goes to invalid when INVALID is received", () => {
    const actor = createActor(scanBarcodeMachine);
    actor.start();
    actor.send({ type: "CODE_SCANNED", barcode: "1234567890" });
    actor.send({ type: "INVALID" });
    expect(actor.getSnapshot().value).toBe("invalid");
  });
});
