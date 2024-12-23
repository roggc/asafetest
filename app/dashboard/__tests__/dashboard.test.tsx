// app/dashboard/__tests__/dashboard.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Dashboard from "../page";
// Ojo: Ajusta la ruta si es distinta en tu proyecto

// Mock de next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock de next/navigation (para la función redirect)
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock de las funciones que fetch-ean datos
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

  it("muestra 'Loading...' si la sesión está en estado loading", () => {
    // Simulamos status 'loading'
    (useSession as jest.Mock).mockReturnValue({ status: "loading" });

    render(<Dashboard />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirecciona al home si la sesión está 'unauthenticated'", () => {
    // Simulamos status 'unauthenticated'
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });

    render(<Dashboard />);
    // Verificamos que se llamó a redirect("/")
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("renderiza la UI principal cuando la sesión está 'authenticated'", async () => {
    // Simulamos status 'authenticated'
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });

    // Simulamos la respuesta de fetchCryptoList y fetchCryptoData
    (fetchCryptoList as jest.Mock).mockResolvedValueOnce([
      { id: "bitcoin", name: "Bitcoin" },
      // si quieres más criptos, las agregas
    ]);
    (fetchCryptoData as jest.Mock).mockResolvedValueOnce([
      { date: "2023-01-01", price: 30000 },
      { date: "2023-01-02", price: 31000 },
    ]);

    render(<Dashboard />);

    // Esperamos a que se carguen los datos y se muestre el título "Price of Bitcoin"
    // (el componente en su useEffect llama a fetchCryptoList y fetchCryptoData)
    expect(await screen.findByText("Price of Bitcoin")).toBeInTheDocument();

    // También podemos revisar que aparezca el "Last 30 days",
    // o que el gráfico se haya montado, etc.
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("muestra un spinner (Loader2) mientras se cargan los datos (isLoading = true)", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });

    // Para que veamos isLoading en acción,
    // hacemos fetchCryptoList y fetchCryptoData resolviendo un poco después.
    let resolveList: (value?: unknown) => void = () => {};
    let resolveData: (value?: unknown) => void = () => {};

    (fetchCryptoList as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveList = resolve; // guardamos para luego
        })
    );
    (fetchCryptoData as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveData = resolve;
        })
    );

    render(<Dashboard />);
    // Mientras no se resuelvan las promesas, "isLoading" estará en true.
    // Debería aparecer la clase "animate-spin" o el <Loader2 />

    // Buscamos el Loader:
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    // Nota: El <Loader2> no trae un role por defecto,
    // podrías asignarle aria-role="progressbar" o usar getByTestId.

    // Ahora resolvemos las promesas para simular que la data finalmente llega
    resolveList?.();
    resolveData?.();

    // Esperamos un ciclo para que el state isLoading pase a false
    await waitFor(() => {
      expect(fetchCryptoList).toHaveBeenCalled();
      expect(fetchCryptoData).toHaveBeenCalled();
    });
  });
});
