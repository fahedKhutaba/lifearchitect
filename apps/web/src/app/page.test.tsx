import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import Home from "./page";

it("renders the app name", () => {
  vi.stubGlobal("fetch", () => new Promise(() => {}));
  render(<Home />);
  expect(screen.getByRole("heading", { name: "LifeArchitect" })).toBeDefined();
});
