"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast();

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-green-200";
      case "error":
        return "border-red-200";
      case "warning":
        return "border-yellow-200";
      case "info":
        return "border-blue-200";
      default:
        return "border-gray-200";
    }
  };

  return (
    <div
      className={cn(
        "min-w-[350px] max-w-[420px] bg-white rounded-lg shadow-lg border-l-4 p-4 animate-in slide-in-from-top-5",
        getBorderColor(toast.type)
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon(toast.type)}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1 text-sm text-gray-500">
              {toast.description}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => removeToast(toast.id)}
          >
            <span className="sr-only">Закрыть</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions for easier usage
export const toast = {
  success: (title: string, description?: string) => {
    const { addToast } = useToast();
    addToast({ type: "success", title, description });
  },
  error: (title: string, description?: string) => {
    const { addToast } = useToast();
    addToast({ type: "error", title, description });
  },
  warning: (title: string, description?: string) => {
    const { addToast } = useToast();
    addToast({ type: "warning", title, description });
  },
  info: (title: string, description?: string) => {
    const { addToast } = useToast();
    addToast({ type: "info", title, description });
  },
};
