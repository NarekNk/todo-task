"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        {children}
        <Toaster />
      </Suspense>
    </SessionProvider>
  );
}
