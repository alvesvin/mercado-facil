import { fireEvent, render, screen } from "@testing-library/react-native";
import { mock } from "jest-mock-extended";
import * as VisionCamera from "react-native-vision-camera";
import { ScanBarcodeView } from "./ScanBarcodeView";

describe("ScanBarcodeView", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render", () => {
    jest.spyOn(VisionCamera, "useCameraPermission").mockReturnValue({
      hasPermission: true,
      requestPermission: jest.fn(),
    });
    render(<ScanBarcodeView state="idle" onCancel={() => {}} onCodeScanned={() => {}} />);
  });

  it("should render the permission state", () => {
    jest.spyOn(VisionCamera, "useCameraPermission").mockReturnValue({
      hasPermission: false,
      requestPermission: jest.fn(),
    });
    render(<ScanBarcodeView state="idle" onCancel={() => {}} onCodeScanned={() => {}} />);
    expect(screen.getByText("Precisamos da camera para escanear")).toBeTruthy();
  });

  it("should render the device state", () => {
    jest.spyOn(VisionCamera, "useCameraPermission").mockReturnValue({
      hasPermission: true,
      requestPermission: jest.fn(),
    });
    jest.spyOn(VisionCamera, "useCameraDevice").mockReturnValue(undefined);
    render(<ScanBarcodeView state="idle" onCancel={() => {}} onCodeScanned={() => {}} />);
    expect(screen.getByText("Nenhuma camera encontrada")).toBeTruthy();
  });

  it("should render the code scanning state", () => {
    jest.spyOn(VisionCamera, "useCameraPermission").mockReturnValue({
      hasPermission: true,
      requestPermission: jest.fn(),
    });
    jest.spyOn(VisionCamera, "useCameraDevice").mockReturnValue(mock() as never);
    render(<ScanBarcodeView state="idle" onCancel={() => {}} onCodeScanned={() => {}} />);
    expect(screen.getByText("Aproxime a câmera do código de barras")).toBeTruthy();
  });

  it("should render the invalid state", () => {
    jest.spyOn(VisionCamera, "useCameraPermission").mockReturnValue({
      hasPermission: true,
      requestPermission: jest.fn(),
    });
    jest.spyOn(VisionCamera, "useCameraDevice").mockReturnValue(mock() as never);
    render(<ScanBarcodeView state="invalid" onCancel={() => {}} onCodeScanned={() => {}} />);
    expect(screen.getByText("Código inválido. Tente novamente.")).toBeTruthy();
  });

  it("should render the validating state", () => {
    jest.spyOn(VisionCamera, "useCameraPermission").mockReturnValue({
      hasPermission: true,
      requestPermission: jest.fn(),
    });
    jest.spyOn(VisionCamera, "useCameraDevice").mockReturnValue(mock() as never);
    render(<ScanBarcodeView state="validating" onCancel={() => {}} onCodeScanned={() => {}} />);
    expect(screen.getByText("Validando, aguarde um momento...")).toBeTruthy();
  });

  it("should render the cancel button", () => {
    jest.spyOn(VisionCamera, "useCameraPermission").mockReturnValue({
      hasPermission: true,
      requestPermission: jest.fn(),
    });
    jest.spyOn(VisionCamera, "useCameraDevice").mockReturnValue(mock() as never);
    const onCancel = jest.fn();
    render(<ScanBarcodeView state="idle" onCancel={onCancel} onCodeScanned={() => {}} />);
    expect(screen.getByText("Cancelar")).toBeTruthy();
    fireEvent.press(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalled();
  });
});
