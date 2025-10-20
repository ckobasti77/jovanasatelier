"use client";

import { useEffect, useState } from "react";

import { getSessionToken } from "@/lib/auth-storage";

export function useSessionToken() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    setSessionToken(getSessionToken());
    const handle = () => setSessionToken(getSessionToken());
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  }, []);

  return sessionToken;
}
