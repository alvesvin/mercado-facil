import { fireEvent, render, screen } from "@testing-library/react-native";
import { ConfirmPriceView } from "./ConfirmPrice.view";

jest.mock("expo-router", () => ({}));

describe("ConfirmPriceView", () => {
  it("renders initial value correctly", () => {
    render(
      <ConfirmPriceView
        isNewProduct={false}
        value={100}
        setValue={() => {}}
        onCancel={() => {}}
        onConfirm={() => {}}
        isCreatingPrice={false}
      />,
    );
    expect(screen.getByText("100,00")).toBeTruthy();
  });

  it("renders creating price message when creating price", () => {
    render(
      <ConfirmPriceView
        isNewProduct={false}
        value={100}
        setValue={() => {}}
        onCancel={() => {}}
        onConfirm={() => {}}
        isCreatingPrice={true}
      />,
    );
    expect(screen.getByText("Confirmando...")).toBeTruthy();
  });

  it("renders confirm button when not creating price", () => {
    render(
      <ConfirmPriceView
        isNewProduct={false}
        value={100}
        setValue={() => {}}
        onCancel={() => {}}
        onConfirm={() => {}}
        isCreatingPrice={false}
      />,
    );
    expect(screen.getByText("Confirmar")).toBeTruthy();
  });

  it("renders cancel button when creating price", () => {
    render(
      <ConfirmPriceView
        isNewProduct={false}
        value={100}
        setValue={() => {}}
        onCancel={() => {}}
        onConfirm={() => {}}
        isCreatingPrice={true}
      />,
    );
    expect(screen.getByText("Cancelar")).toBeTruthy();
  });

  it("renders disabled confirm button when creating price", () => {
    render(
      <ConfirmPriceView
        isNewProduct={false}
        value={100}
        setValue={() => {}}
        onCancel={() => {}}
        onConfirm={() => {}}
        isCreatingPrice={true}
      />,
    );
    expect(screen.getByText("Confirmando...")).toBeDisabled();
  });

  it("renders enabled confirm button when not creating price", () => {
    render(
      <ConfirmPriceView
        isNewProduct={false}
        value={100}
        setValue={() => {}}
        onCancel={() => {}}
        onConfirm={() => {}}
        isCreatingPrice={false}
      />,
    );
    expect(screen.getByText("Confirmar")).toBeEnabled();
  });

  it("renders disabled cancel button when creating price", () => {
    render(
      <ConfirmPriceView
        isNewProduct={false}
        value={100}
        setValue={() => {}}
        onCancel={() => {}}
        onConfirm={() => {}}
        isCreatingPrice={true}
      />,
    );
    expect(screen.getByText("Cancelar")).toBeDisabled();
  });

  it("calls onCancel when cancel button is pressed", () => {
    const onCancel = jest.fn();
    render(
      <ConfirmPriceView
        isNewProduct={false}
        value={100}
        setValue={() => {}}
        onCancel={onCancel}
        onConfirm={() => {}}
        isCreatingPrice={false}
      />,
    );
    fireEvent.press(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onConfirm when confirm button is pressed", () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmPriceView
        isNewProduct={false}
        value={100}
        setValue={() => {}}
        onCancel={() => {}}
        onConfirm={onConfirm}
        isCreatingPrice={false}
      />,
    );
    fireEvent.press(screen.getByText("Confirmar"));
    expect(onConfirm).toHaveBeenCalled();
  });
});
