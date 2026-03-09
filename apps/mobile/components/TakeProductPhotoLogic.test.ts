import type { Camera } from "react-native-vision-camera";
import { handleTakePhoto } from "./TakeProductPhotoLogic";

describe("handleTakePhoto", () => {
  let sideEffects: Parameters<typeof handleTakePhoto>[0];

  beforeEach(() => {
    sideEffects = {
      camera: { takePhoto: jest.fn().mockResolvedValue({ path: "test.jpg" }) } as unknown as Camera,
      scanWorkflowEmit: jest.fn(),
      generateProductInfo: jest.fn().mockResolvedValue({ quantity: 1, quantityUnit: "unit" }),
      fetchLocalFileBase64: jest.fn().mockResolvedValue("AA=="),
    };
  });

  it("should send a PHOTO_TAKEN event", async () => {
    await handleTakePhoto(sideEffects);
    expect(sideEffects.scanWorkflowEmit).toHaveBeenCalledWith({
      type: "PHOTO_TAKEN",
      photo: { base64: "AA==", mimeType: "image/jpeg" },
    });
  });

  it("should send a INFO_GOOD event if the product info is good", async () => {
    sideEffects.generateProductInfo = jest
      .fn()
      .mockResolvedValue({ quantity: 1, quantityUnit: "unit" });
    await handleTakePhoto(sideEffects);
    expect(sideEffects.scanWorkflowEmit).toHaveBeenCalledWith({
      type: "INFO_GOOD",
      product: { quantity: 1, quantityUnit: "unit" },
    });
  });

  it("should send a INFO_BAD event if the product info is bad", async () => {
    sideEffects.generateProductInfo = jest
      .fn()
      .mockResolvedValue({ quantity: 1, quantityUnit: null });
    await handleTakePhoto(sideEffects);
    expect(sideEffects.scanWorkflowEmit).toHaveBeenCalledWith({
      type: "INFO_BAD",
      product: { quantity: 1, quantityUnit: undefined },
    });
  });

  it("should send INFO_BAD event if the product info is null", async () => {
    sideEffects.generateProductInfo = jest.fn().mockResolvedValue(null);
    await handleTakePhoto(sideEffects);
    expect(sideEffects.scanWorkflowEmit).toHaveBeenCalledWith({
      type: "INFO_BAD",
      product: null,
    });
  });
});
