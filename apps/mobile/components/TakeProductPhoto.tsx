import * as ImagePicker from "expo-image-picker";
import { useEffect, useEffectEvent } from "react";
import { ProductScanMachineContext } from "./ProductScanMachineContext";

export function TakeProductPhoto() {
  const actorRef = ProductScanMachineContext.useActorRef();

  const takePhotoEvent = useEffectEvent(async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      base64: true,
      quality: 1,
    });
    if (result.canceled) {
      actorRef.send({ type: "product.photo.canceled" });
      return;
    }
    actorRef.send({ type: "product.photo.taken", photo: result.assets[0] });
  });

  useEffect(() => {
    takePhotoEvent();
  }, []);

  return null;
}
