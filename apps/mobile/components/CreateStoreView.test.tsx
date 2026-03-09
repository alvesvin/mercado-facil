import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { CreateStoreView } from "./CreateStoreView";

describe("CreateStoreView", () => {
  it("should render", () => {
    render(<CreateStoreView onSubmit={() => {}} onCancel={() => {}} />);
  });

  it("should show input error if name is empty", async () => {
    render(<CreateStoreView onSubmit={() => {}} onCancel={() => {}} />);
    fireEvent.press(screen.getByText("Continuar"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Nome é obrigatório"));
  });

  it("should show input error if name is less than 3 characters", async () => {
    render(<CreateStoreView onSubmit={() => {}} onCancel={() => {}} />);
    fireEvent.changeText(screen.getByPlaceholderText("Digite o nome da loja"), "12");
    fireEvent.press(screen.getByText("Continuar"));
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Nome deve ter pelo menos 3 caracteres"),
    );
  });

  it("should submit form if name is valid", async () => {
    const onSubmit = jest.fn();
    render(<CreateStoreView onSubmit={onSubmit} onCancel={() => {}} />);
    fireEvent.changeText(screen.getByPlaceholderText("Digite o nome da loja"), "123");
    fireEvent.press(screen.getByText("Continuar"));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it("should call onCancel when cancel button is pressed", async () => {
    const onCancel = jest.fn();
    render(<CreateStoreView onSubmit={() => {}} onCancel={onCancel} />);
    fireEvent.press(screen.getByText("Cancelar"));
    await waitFor(() => expect(onCancel).toHaveBeenCalledTimes(1));
  });
});
