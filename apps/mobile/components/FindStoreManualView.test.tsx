import { render, screen } from "@testing-library/react-native";
import { FindStoreManualView } from "./FindStoreManualView";

describe("FindStoreManualView", () => {
  it("should render", () => {
    render(
      <FindStoreManualView
        search=""
        setSearch={() => {}}
        stores={[]}
        isLoading={false}
        selectingStoreId={""}
        onNotFound={() => {}}
        onSelectStore={() => {}}
      />,
    );
  });

  it("should render loading state when loading", () => {
    render(
      <FindStoreManualView
        search=""
        setSearch={() => {}}
        stores={[]}
        isLoading={true}
        selectingStoreId={""}
        onNotFound={() => {}}
        onSelectStore={() => {}}
      />,
    );

    expect(screen.getByText("Buscando mercados próximos a você")).toBeTruthy();
  });

  it("should render stores when stores are available", () => {
    render(
      <FindStoreManualView
        search=""
        setSearch={() => {}}
        stores={[{ id: "1", name: "Store 1", address: "Address 1", distance: 10 }]}
        isLoading={false}
        selectingStoreId={""}
        onNotFound={() => {}}
        onSelectStore={() => {}}
      />,
    );
    expect(screen.getByText("Store 1")).toBeTruthy();
    expect(screen.getByText("Address 1")).toBeTruthy();
  });

  it("it only renders the selected store when selecting store", () => {
    render(
      <FindStoreManualView
        search="brab"
        setSearch={() => {}}
        stores={[
          { id: "1", name: "Store 1", address: "Address 1", distance: 10 },
          { id: "2", name: "Store 2", address: "Address 2", distance: 20 },
        ]}
        isLoading={false}
        selectingStoreId="1"
        onNotFound={() => {}}
        onSelectStore={() => {}}
      />,
    );
    expect(screen.getByTestId("select-store-1")).toBeDisabled();
    expect(screen.queryByTestId("select-store-2")).toBeNull();
  });

  it("should render not found button when not found", () => {
    render(
      <FindStoreManualView
        search="mer"
        setSearch={() => {}}
        stores={[]}
        isLoading={false}
        selectingStoreId={""}
        onNotFound={() => {}}
        onSelectStore={() => {}}
      />,
    );
    expect(screen.getByText("Não conseguiu encontrar? Aperte aqui.")).toBeTruthy();
  });
});
