import type { GenerateProductInfoFn } from "@mercado-facil/trpc-types";
import { encode } from "base64-arraybuffer";
import type { Camera } from "react-native-vision-camera";
import type { ScanWorkflowEmitter } from "./machines/scan-workflow.machine";

export async function fetchLocalFileBase64(path: string) {
  const result = await fetch(`file://${path}`);
  const arrayBuffer = await result.arrayBuffer();
  return encode(arrayBuffer);
}

export async function handleTakePhoto(sideEffects: {
  camera: Camera;
  scanWorkflowEmit: ScanWorkflowEmitter;
  generateProductInfo: GenerateProductInfoFn;
  fetchLocalFileBase64: typeof fetchLocalFileBase64;
}) {
  const file = await sideEffects.camera.takePhoto({ enableShutterSound: true });
  if (!file) return;
  const base64 = await sideEffects.fetchLocalFileBase64(file.path);

  // TODO: get the right mime type from the file
  sideEffects.scanWorkflowEmit({
    type: "PHOTO_TAKEN",
    photo: { base64, mimeType: "image/jpeg" },
  });

  const productInfo = await sideEffects.generateProductInfo({
    images: [{ base64, mime: "image/jpeg" }],
  });

  if (productInfo?.quantity && productInfo.quantityUnit) {
    sideEffects.scanWorkflowEmit({
      type: "INFO_GOOD",
      product: {
        ...productInfo,
        quantity: productInfo.quantity ?? undefined,
        quantityUnit: productInfo.quantityUnit ?? undefined,
      },
    });
  } else {
    sideEffects.scanWorkflowEmit({
      type: "INFO_BAD",
      product: productInfo && {
        ...productInfo,
        quantity: productInfo.quantity ?? undefined,
        quantityUnit: productInfo.quantityUnit ?? undefined,
      },
    });
  }
}
