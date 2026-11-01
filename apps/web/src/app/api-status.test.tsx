import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ApiStatus } from "./api-status";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function stubFetch(impl: (url: string) => Promise<unknown>) {
  const fn = vi.fn(impl);
  vi.stubGlobal("fetch", fn);
  return fn;
}

it("shows loading while the request is in flight", () => {
  stubFetch(() => new Promise(() => {}));
  render(<ApiStatus />);
  expect(screen.getByText("API: loading")).toBeDefined();
});

it("shows ok for 200 with status ok", async () => {
  const fn = stubFetch(async () => new Response(JSON.stringify({ status: "ok" }), { status: 200 }));
  render(<ApiStatus />);
  expect(await screen.findByText("API: ok")).toBeDefined();
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn.mock.calls[0]?.[0]).toBe("http://localhost:3001/health");
});

it("shows unreachable on a network error", async () => {
  stubFetch(async () => {
    throw new TypeError("Failed to fetch");
  });
  render(<ApiStatus />);
  expect(await screen.findByText("API: unreachable")).toBeDefined();
});

it("shows unreachable on a non-200 response", async () => {
  stubFetch(async () => new Response(JSON.stringify({ status: "ok" }), { status: 500 }));
  render(<ApiStatus />);
  expect(await screen.findByText("API: unreachable")).toBeDefined();
});

it("shows unreachable on an unexpected body", async () => {
  stubFetch(async () => new Response(JSON.stringify({ status: "down" }), { status: 200 }));
  render(<ApiStatus />);
  expect(await screen.findByText("API: unreachable")).toBeDefined();
});
