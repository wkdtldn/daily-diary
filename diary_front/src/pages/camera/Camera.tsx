import { Camera, CameraResultType } from "@capacitor/camera";
import { IonButton, IonIcon } from "@ionic/react";
import { camera, image } from "ionicons/icons";
import { useState } from "react";

export function CameraComponent() {
  const [photo, setPhoto] = useState<string | undefined>("");

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
    });
    console.log(image);
    setPhoto(image.dataUrl);
  };
  return (
    <IonButton onClick={() => takePicture()}>
      <IonIcon icon={camera}></IonIcon>
    </IonButton>
  );
}
