import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";
import { renderWithProviders } from "@/test/renderWithProviders";

const useSalonsMock = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/useSalons", () => ({
  useSalons: useSalonsMock,
}));

describe("Index salons block", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("hairline-lang", "en");
  });

  it("renders branches from API salons instead of hardcoded branch content", () => {
    useSalonsMock.mockReturnValue({
      salons: [
        {
          id: "10",
          code: "east",
          name: "HairLine East",
          address: "Manas Ave, 10",
          workHours: "10:00 - 20:00",
          latitude: 42.87,
          longitude: 74.62,
          isActive: true,
          sortOrder: 1,
        },
        {
          id: "11",
          code: "west",
          name: "HairLine West",
          address: "Aaly Tokombaev, 91",
          workHours: "11:00 - 21:00",
          latitude: 42.83,
          longitude: 74.58,
          isActive: true,
          sortOrder: 2,
        },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<Index />, { route: "/" });

    expect(screen.getByText("HairLine East")).toBeInTheDocument();
    expect(screen.getByText("Manas Ave, 10")).toBeInTheDocument();
    expect(screen.getByText("HairLine West")).toBeInTheDocument();

    expect(
      screen.queryByText("Modern salon in the city center with premium barber services."),
    ).not.toBeInTheDocument();
  });
});
