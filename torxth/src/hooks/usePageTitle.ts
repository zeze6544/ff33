import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title.includes('Torxth')
      ? title
      : `${title} | Torxth Technology`
    return () => {
      document.title = previous
    }
  }, [title])
}
