import { useToast } from '../../hooks/useToast'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex w-[min(92vw,22rem)] -translate-x-1/2 flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismiss(toast.id)}
          className="pointer-events-auto animate-rise rounded-md bg-ink px-4 py-3 text-left text-sm font-medium text-paper shadow-lg"
        >
          {toast.message}
        </button>
      ))}
    </div>
  )
}
