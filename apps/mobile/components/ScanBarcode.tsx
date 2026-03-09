import { ScanWorkflowActorContext } from "./machines/scan-workflow.machine";
import {
  fetchProductByBarcode,
  handleCancelScanBarcode,
  handleCodeScanned,
  isValidEAN,
} from "./ScanBarcode.logic";
import { ScanBarcodeView } from "./ScanBarcode.view";
import { useMachine } from "@xstate/react";
import { scanBarcodeMachine } from "./ScanBarcode.logic";
import { useAudioPlayer } from "expo-audio";
import { notificationAsync } from "expo-haptics";
const beepSource = require("@/assets/audio/beep.wav");

export function ScanBarcode() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const cart = ScanWorkflowActorContext.useSelector((state) => state.context.cart)!;
  const [state, scanBarcodeEmit] = useMachine(scanBarcodeMachine);
  const beep = useAudioPlayer(beepSource);

  function onCancel() {
    handleCancelScanBarcode({ send: actor.send });
  }

  function onCodeScanned(barcode: string) {
    handleCodeScanned(
      { barcode: barcode, storeId: cart.storeId! },
      {
        scanBarcodeEmit,
        scanWorkflowEmit: actor.send,
        haptics: { notificationAsync },
        beep: beep,
        fetchProductByBarcode: fetchProductByBarcode,
        isValidEAN: isValidEAN,
      },
    );
  }

  return <ScanBarcodeView state={state.value} onCancel={onCancel} onCodeScanned={onCodeScanned} />;
}
