import { render, screen } from "@testing-library/react-native";
import { FindNearbyStoreView } from "./FindNearbyStoreView";

describe("FindNearbyStoreView", () => {
  it("should render", () => {
    render(
      <FindNearbyStoreView
        cart={{ store: { id: "1" } }}
        store={{ name: "Store 1", city: "City 1", address: "Address 1" }}
        isLoading={false}
        isUpdatingCartStore={false}
        onConfirm={() => {}}
        onReject={() => {}}
      />,
    );
  });

  it("should render loading state when loading", () => {
    render(
      <FindNearbyStoreView
        cart={{ store: { id: "1" } }}
        store={null}
        isLoading={true}
        isUpdatingCartStore={false}
        onConfirm={() => {}}
        onReject={() => {}}
      />,
    );
    expect(screen.getByText("Procurando mercado perto de você")).toBeTruthy();
  });

  it("should render store details when store is found", () => {
    render(
      <FindNearbyStoreView
        cart={{ store: { id: "1" } }}
        store={{ name: "Store 1", city: "City 1", address: "Address 1" }}
        isLoading={false}
        isUpdatingCartStore={false}
        onConfirm={() => {}}
        onReject={() => {}}
      />,
    );
    expect(screen.getByText("Store 1 - City 1")).toBeTruthy();
    expect(screen.getByText("Address 1")).toBeTruthy();
  });

  it("should render updating cart store state when updating cart store", () => {
    render(
      <FindNearbyStoreView
        cart={{ store: { id: "1" } }}
        store={{ name: "Store 1", city: "City 1", address: "Address 1" }}
        isLoading={false}
        isUpdatingCartStore={true}
        onConfirm={() => {}}
        onReject={() => {}}
      />,
    );
    expect(screen.getByText("Confirmando...")).toBeTruthy();
  });
});
