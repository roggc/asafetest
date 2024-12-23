// app/infinite-scroll/__tests__/infinite-scroll.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import InfiniteScroll from "../page";

// Mock de next-auth/react (useSession)
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock de redirect (next/navigation)
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock de la custom hook
jest.mock("../use-intersection-observer", () => ({
  useIntersectionObserver: jest.fn(),
}));

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useIntersectionObserver } from "../use-intersection-observer";

describe("InfiniteScroll page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // También limpiamos fetch si lo usamos en cada test
    global.fetch = jest.fn();
  });

  it("muestra 'Loading...' si la sesión está en estado 'loading'", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "loading" });

    render(<InfiniteScroll />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirecciona a '/' si la sesión está 'unauthenticated'", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });

    render(<InfiniteScroll />);
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("renderiza sin items inicialmente cuando la sesión está 'authenticated'", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });
    // Por defecto, no llamaremos onIntersect todavía
    (useIntersectionObserver as jest.Mock).mockImplementation(() => {});

    render(<InfiniteScroll />);
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("carga y muestra nuevos items cuando se dispara el onIntersect", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });

    // Mock de la respuesta del fetch
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

    // (global.fetch as jest.Mock).mockResolvedValue({
    //   ok: true,
    //   json: async () => mockItems,
    // });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockItems, // Primera llamada: 2 ítems
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [], // Segunda llamada (Strict Mode): 0 ítems
      });

    // Simulamos que al montar el componente, la custom hook llama `onIntersect`.
    (useIntersectionObserver as jest.Mock).mockImplementation(
      ({ onIntersect }) => {
        // Llamamos onIntersect de forma inmediata, como si se intersectara el loader.
        onIntersect();
      }
    );

    render(<InfiniteScroll />);

    // Verificamos que se haya hecho el fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Una vez que se resuelve la promesa, esperamos ver los items en el DOM
    expect(await screen.findByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();

    // Deben existir 2 <li> con CryptoCard
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("muestra 'Loading more elements...' en el loader div mientras está cargando", async () => {
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
