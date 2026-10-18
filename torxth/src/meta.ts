import { useEffect } from 'react'

export function useMeta(title: string, description?: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title.includes('Torxth') ? title : `${title} · Torxth Technology`
    if (description) {
      let el = document.querySelector('meta[name="description"]')
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', 'description')
        document.head.appendChild(el)
      }
      el.setAttribute('content', description)
    }
    return () => {
      document.title = prev
    }
  }, [title, description])
}
