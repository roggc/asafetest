// tests/home.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/lib/auth", () => ({
  authOptions: {},
}));

import Home from "@/app/page";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from "next-auth";

describe("Home Page", () => {
  it("Shows Sign in button if there is NO session", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    const ui = await Home();
    render(ui);

    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("shows 'Welcome, John Doe!' if there is a session", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { name: "John Doe" },
    });

    const ui = await Home();
    render(ui);

    expect(screen.getByText("Welcome, John Doe!")).toBeInTheDocument();
  });
});
