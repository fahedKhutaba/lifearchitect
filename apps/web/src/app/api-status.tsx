"use client";

import type { HealthResponse } from "@lifearchitect/contracts";
import { useEffect, useState } from "react";

type Status = "loading" | "ok" | "unreachable";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function ApiStatus() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch(`${API_URL}/health`);
        if (res.status !== 200) throw new Error("non-200");
        const body = (await res.json()) as Partial<HealthResponse> | null;
        if (body?.status !== "ok") throw new Error("unexpected body");
        if (!cancelled) setStatus("ok");
      } catch {
        if (!cancelled) setStatus("unreachable");
      }
    }
    void check();
    return () => {
      cancelled = true;
    };
  }, []);

  return <p>API: {status}</p>;
}
