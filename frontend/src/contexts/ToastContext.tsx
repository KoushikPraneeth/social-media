import { createContext, useContext, useState } from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../components/ui/toast"

interface ToastContextType {
  showToast: (props: { title?: string; description: string; type?: "success" | "error" }) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    title?: string;
    description: string;
    type?: "success" | "error";
  }>>([])

  const showToast = ({ title, description, type = "success" }: {
    title?: string;
    description: string;
    type?: "success" | "error";
  }) => {
    const id = Math.random().toString(36).substring(2)
    setToasts((prev) => [...prev, { id, title, description, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastProvider>
        {toasts.map(({ id, title, description, type }) => (
          <Toast
            key={id}
            className={
              type === "error"
                ? "border-destructive bg-destructive/10 text-destructive dark:border-red-400 dark:bg-red-950/50 dark:text-red-300"
                : "border-green-500 bg-green-500/10 text-green-700 dark:border-green-400 dark:bg-green-950/50 dark:text-green-300"
            }
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              <ToastDescription>{description}</ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastContextProvider")
  }
  return context
}
