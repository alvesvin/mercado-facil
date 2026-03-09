import type { AudioPlayer } from "expo-audio";
import type { ScanWorkflowEmitter } from "./machines/scan-workflow.machine";
import { notificationAsync, NotificationFeedbackType } from "expo-haptics";
import { setup } from "xstate";
import type { CodeType } from "react-native-vision-camera";

export type ScanBarcodeEvents =
  | { type: "CODE_SCANNED"; barcode: string }
  | { type: "VALID" }
  | { type: "INVALID" };

export type ScanBarcodeMachineState = "idle" | "validating" | "invalid";

type ScanBarcodeEmitter = (event: ScanBarcodeEvents) => void;

export const codeTypes: CodeType[] = ["ean-13", "ean-8", "upc-a"];

export const scanBarcodeMachine = setup({
  types: { events: {} as ScanBarcodeEvents, context: {} as { barcode: string } },
}).createMachine({
  id: "scan-barcode",
  initial: "idle",
  context: { barcode: "" },
  states: {
    idle: { on: { CODE_SCANNED: { target: "validating" } } },
    validating: { on: { INVALID: { target: "invalid" } } },
    invalid: { on: { CODE_SCANNED: { target: "validating" } } },
  },
});

export function handleCancelScanBarcode(sideEffects: { send: ScanWorkflowEmitter }) {
  sideEffects.send({ type: "CANCELLED" });
}

export async function fetchProductByBarcode(deps: { barcode: string; storeId: string }) {
  const { queryClient } = await import("@/lib/tanstack-query");
  const { api } = await import("@/lib/api");
  return await queryClient.fetchQuery({
    queryKey: ["product", "findWithPriceByBarcodeSaga", { barcode: deps.barcode, type: "query" }],
    queryFn: () =>
      api.product.findWithPriceByBarcodeSaga.query({
        barcode: deps.barcode,
        storeId: deps.storeId,
      }),
  });
}

export async function handleCodeScanned(
  deps: { barcode: string; storeId: string },
  sideEffects: {
    scanBarcodeEmit: ScanBarcodeEmitter;
    scanWorkflowEmit: ScanWorkflowEmitter;
    haptics: { notificationAsync: typeof notificationAsync };
    beep: AudioPlayer;
    fetchProductByBarcode: typeof fetchProductByBarcode;
    isValidEAN: typeof isValidEAN;
  },
) {
  sideEffects.scanBarcodeEmit({ type: "CODE_SCANNED", barcode: deps.barcode });

  sideEffects.haptics.notificationAsync(NotificationFeedbackType.Success);
  sideEffects.beep.seekTo(0);
  sideEffects.beep.play();

  if (!sideEffects.isValidEAN(deps.barcode)) {
    sideEffects.scanBarcodeEmit({ type: "INVALID" });
    return;
  }

  try {
    const product = await sideEffects.fetchProductByBarcode({
      barcode: deps.barcode,
      storeId: deps.storeId,
    });

    if (product) {
      sideEffects.haptics.notificationAsync(NotificationFeedbackType.Success);
      sideEffects.scanWorkflowEmit({
        type: "PRODUCT_FOUND",
        product: product.product,
        prices: product.prices,
      });
    } else {
      sideEffects.haptics.notificationAsync(NotificationFeedbackType.Warning);
      sideEffects.scanWorkflowEmit({ type: "PRODUCT_NOT_FOUND", barcode: deps.barcode });
    }
  } catch (error) {
    sideEffects.haptics.notificationAsync(NotificationFeedbackType.Error);
  }
}

export function getCanScan(): (state: ScanBarcodeMachineState) => boolean {
  let timeout: NodeJS.Timeout | null = null;
  let can = true;

  return (state: ScanBarcodeMachineState) => {
    const result = can && (state === "idle" || state === "invalid");

    if (!result) return false;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      can = true;
    }, 1500);

    can = false;

    return result;
  };
}

export function isValidEAN(code: string): boolean {
  if (!/^\d+$/.test(code)) return false;

  if (code.length !== 8 && code.length !== 13) return false;

  const digits = code.split("").map(Number);
  const checkDigit = digits.pop()!;

  const sum = digits.reverse().reduce((acc, digit, index) => {
    const weight = index % 2 === 0 ? 3 : 1;
    return acc + digit * weight;
  }, 0);

  const calculatedCheck = (10 - (sum % 10)) % 10;

  return calculatedCheck === checkDigit;
}
