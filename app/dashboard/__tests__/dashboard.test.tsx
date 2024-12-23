// app/dashboard/__tests__/dashboard.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Dashboard from "../page";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/app/utils/data", () => ({
  fetchCryptoList: jest.fn(),
  fetchCryptoData: jest.fn(),
}));

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { fetchCryptoData, fetchCryptoList } from "@/app/utils/data";

describe("Dashboard page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("shows 'Loading...' if session is in loading state", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "loading" });

    render(<Dashboard />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to home is session is 'unauthenticated'", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });

    render(<Dashboard />);
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("renders main UI when session is 'authenticated'", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });

    (fetchCryptoList as jest.Mock).mockResolvedValueOnce([
      { id: "bitcoin", name: "Bitcoin" },
    ]);
    (fetchCryptoData as jest.Mock).mockResolvedValueOnce([
      { date: "2023-01-01", price: 30000 },
      { date: "2023-01-02", price: 31000 },
    ]);

    render(<Dashboard />);

    expect(await screen.findByText("Price of Bitcoin")).toBeInTheDocument();

    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("shows a spinner when data is being loaded (isLoading = true)", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });

    let resolveList: (value?: unknown) => void = () => {};
    let resolveData: (value?: unknown) => void = () => {};

    (fetchCryptoList as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveList = resolve;
        })
    );
    (fetchCryptoData as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveData = resolve;
        })
    );

    render(<Dashboard />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    resolveList?.();
    resolveData?.();

    await waitFor(() => {
      expect(fetchCryptoList).toHaveBeenCalled();
      expect(fetchCryptoData).toHaveBeenCalled();
    });
  });
});
