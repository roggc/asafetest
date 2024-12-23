// tests/home.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// 1. Mocks antes de importar el componente
jest.mock("@/app/lib/auth", () => ({
  // Exporta un objeto 'authOptions' vacío o mínimo
  authOptions: {},
}));

// 2. Ahora que ya mockeamos la ruta, importamos el Home
import Home from "@/app/page";

// 3. Mockeamos next-auth también
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from "next-auth";

describe("Home Page", () => {
  it("muestra el botón Sign in si NO hay sesión", async () => {
    // getServerSession responde null
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const ui = await Home();
    render(ui);

    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("muestra 'Welcome, John Doe!' si SÍ hay sesión", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { name: "John Doe" },
    });

    const ui = await Home();
    render(ui);

    expect(screen.getByText("Welcome, John Doe!")).toBeInTheDocument();
  });
});
