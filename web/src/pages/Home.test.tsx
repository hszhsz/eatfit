import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Home from "@/pages/Home";

describe("Home", () => {
  it("renders the landing page headline and CTA", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/The nutrition platform that looks as sharp/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get Started/i })).toBeInTheDocument();
  });
});
