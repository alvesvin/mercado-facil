import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { Camera } from "react-native-vision-camera";
import { useTRPC } from "@/lib/trpc";
import { ScanWorkflowActorContext } from "./machines/scan-workflow.machine";
import { fetchLocalFileBase64, handleTakePhoto } from "./TakeProductPhotoLogic";
import { TakeProductPhotoView } from "./TakeProductPhotoView";

export function TakeProductPhoto() {
  const actor = ScanWorkflowActorContext.useActorRef();
  const cameraRef = useRef<Camera>(null);
  const [isGeneratingProductInfo, setIsGeneratingProductInfo] = useState(false);

  const trpc = useTRPC();
  const { mutateAsync: generateProductInfo } = useMutation(
    trpc.ai.generateProductInfo.mutationOptions(),
  );

  async function onTakePhoto() {
    setIsGeneratingProductInfo(true);
    const camera = cameraRef.current;
    if (!camera) return;
    try {
      await handleTakePhoto({
        camera,
        scanWorkflowEmit: actor.send,
        generateProductInfo: generateProductInfo,
        fetchLocalFileBase64,
      });
    } catch (error) {
      // TODO: handle error
      // biome-ignore lint/suspicious/noConsole: testing
      console.error(error);
    } finally {
      setIsGeneratingProductInfo(false);
    }
  }

  return (
    <TakeProductPhotoView
      isGeneratingProductInfo={isGeneratingProductInfo}
      onTakePhoto={onTakePhoto}
      cameraRef={cameraRef}
    />
  );
}
