import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { products, type Product } from '../data/products'

export type CartItem = {
  productId: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
  slip: string | null
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (productId: string, quantity?: number, label?: string) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
  lines: { product: Product; quantity: number; lineTotal: number }[]
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'torxth-cart-v1'

function loadItems(): CartItem[] {
  try {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (i) =>
        i &&
        typeof i.productId === 'string' &&
        typeof i.quantity === 'number' &&
        i.quantity > 0 &&
        products.some((p) => p.id === i.productId),
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadItems())
  const [isOpen, setIsOpen] = useState(false)
  const [slip, setSlip] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const addItem = useCallback((productId: string, quantity = 1, label?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      }
      return [...prev, { productId, quantity }]
    })
    setIsOpen(true)
    if (label) {
      setSlip(label)
      window.setTimeout(() => setSlip(null), 2400)
    }
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product) return null
          return {
            product,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
          }
        })
        .filter(Boolean) as {
        product: Product
        quantity: number
        lineTotal: number
      }[],
    [items],
  )

  const count = lines.reduce((sum, l) => sum + l.quantity, 0)
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    isOpen,
    slip,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((v) => !v),
    addItem,
    removeItem,
    setQuantity,
    clear,
    lines,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
