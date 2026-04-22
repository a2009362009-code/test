import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MapModal from "@/components/MapModal";
import { renderWithProviders } from "@/test/renderWithProviders";

vi.mock("@/components/SalonsMap", () => ({
  default: ({ locations }: { locations: Array<{ id: string }> }) => (
    <div data-testid="salons-map">Map locations: {locations.length}</div>
  ),
}));

describe("MapModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("hairline-lang", "en");
  });

  it("shows loading state", () => {
    renderWithProviders(
      <MapModal
        onClose={() => {}}
        salons={[]}
        isLoading
        isError={false}
        onRetry={() => {}}
      />,
    );

    expect(screen.getByText("Loading salon locations...")).toBeInTheDocument();
    expect(screen.queryByTestId("salons-map")).not.toBeInTheDocument();
  });

  it("shows error state and retries", () => {
    const onRetry = vi.fn();

    renderWithProviders(
      <MapModal
        onClose={() => {}}
        salons={[]}
        isLoading={false}
        isError
        onRetry={onRetry}
      />,
    );

    expect(
      screen.getByText("Could not load salon locations. Please try again."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("shows empty state", () => {
    renderWithProviders(
      <MapModal
        onClose={() => {}}
        salons={[]}
        isLoading={false}
        isError={false}
        onRetry={() => {}}
      />,
    );

    expect(screen.getByText("No locations available to display on the map.")).toBeInTheDocument();
    expect(screen.queryByTestId("salons-map")).not.toBeInTheDocument();
  });

  it("renders map when salons are available", () => {
    renderWithProviders(
      <MapModal
        onClose={() => {}}
        salons={[
          {
            id: "1",
            code: "center",
            name: "HairLine Center",
            address: "Chuy Ave, 150",
            workHours: "09:00 - 21:00",
            latitude: 42.876731,
            longitude: 74.606215,
            isActive: true,
            sortOrder: 1,
          },
        ]}
        isLoading={false}
        isError={false}
        onRetry={() => {}}
      />,
    );

    expect(screen.getByTestId("salons-map")).toHaveTextContent("Map locations: 1");
  });
});
