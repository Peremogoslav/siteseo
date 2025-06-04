"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { ToastProvider } from "@/components/ui/toast";

interface ClientBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ClientBody({ children, className }: ClientBodyProps) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <body className={className} suppressHydrationWarning>
      <ToastProvider>
        {children}
      </ToastProvider>
    </body>
  );
}
