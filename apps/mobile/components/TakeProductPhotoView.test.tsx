import { render, screen } from "@testing-library/react-native";
import { mock } from "jest-mock-extended";
import * as VisionCamera from "react-native-vision-camera";
import { TakeProductPhotoView } from "./TakeProductPhotoView";

describe("TakeProductPhotoView", () => {
  beforeEach(() => {
    jest.spyOn(VisionCamera, "useCameraPermission").mockReturnValue({
      hasPermission: true,
      requestPermission: jest.fn(),
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render", () => {
    render(
      <TakeProductPhotoView
        cameraRef={{ current: null }}
        isGeneratingProductInfo={false}
        onTakePhoto={() => {}}
      />,
    );
  });

  it("should render the permission state", () => {
    jest.spyOn(VisionCamera, "useCameraPermission").mockReturnValue({
      hasPermission: false,
      requestPermission: jest.fn(),
    });
    render(
      <TakeProductPhotoView
        cameraRef={{ current: null }}
        isGeneratingProductInfo={false}
        onTakePhoto={() => {}}
      />,
    );
    expect(screen.getByText("Precisamos da camera para escanear")).toBeTruthy();
  });

  it("should render the device state", () => {
    jest.spyOn(VisionCamera, "useCameraDevice").mockReturnValue(undefined);
    render(
      <TakeProductPhotoView
        cameraRef={{ current: null }}
        isGeneratingProductInfo={false}
        onTakePhoto={() => {}}
      />,
    );
    expect(screen.getByText("Nenhuma camera encontrada")).toBeTruthy();
  });

  it("should render the camera state", () => {
    jest.spyOn(VisionCamera, "useCameraDevice").mockReturnValue(mock() as never);
    render(
      <TakeProductPhotoView
        cameraRef={{ current: null }}
        isGeneratingProductInfo={false}
        onTakePhoto={() => {}}
      />,
    );
    expect(screen.getByText("Tire uma foto do produto de frente")).toBeTruthy();
  });

  it("should render the generating product info state", () => {
    render(
      <TakeProductPhotoView
        cameraRef={{ current: null }}
        isGeneratingProductInfo={true}
        onTakePhoto={() => {}}
      />,
    );
    expect(screen.getByText("Lendo os detalhes do produto")).toBeTruthy();
  });
});
