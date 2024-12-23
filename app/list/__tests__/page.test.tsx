// app/infinite-scroll/__tests__/infinite-scroll.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import InfiniteScroll from "../page";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("../use-intersection-observer", () => ({
  useIntersectionObserver: jest.fn(),
}));

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useIntersectionObserver } from "../use-intersection-observer";

describe("InfiniteScroll page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  it("shows 'Loading...' if session is in 'loading' state", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "loading" });

    render(<InfiniteScroll />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to '/' if session is 'unauthenticated'", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });

    render(<InfiniteScroll />);
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("initially renders without items when session is 'authenticated'", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });
    (useIntersectionObserver as jest.Mock).mockImplementation(() => {});

    render(<InfiniteScroll />);
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("shows items when onIntersect fires", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });

    const mockItems = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        image: "https://example.com/btc.png",
        current_price: 30000,
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        image: "https://example.com/eth.png",
        current_price: 2000,
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockItems,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    (useIntersectionObserver as jest.Mock).mockImplementation(
      ({ onIntersect }) => {
        onIntersect();
      }
    );

    render(<InfiniteScroll />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(await screen.findByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("shows 'Loading more elements...' when fetching data", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });

    let resolveFetch: (value?: unknown) => void = () => {};
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    (useIntersectionObserver as jest.Mock).mockImplementation(
      ({ onIntersect }) => {
        onIntersect();
      }
    );

    render(<InfiniteScroll />);
    expect(screen.getByText("Loading more elements...")).toBeInTheDocument();
  });
});
