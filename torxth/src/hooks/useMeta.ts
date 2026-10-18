import { useEffect } from 'react'

type MetaInput = {
  title: string
  description?: string
  image?: string
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

export function useMeta({ title, description, image }: MetaInput) {
  useEffect(() => {
    const prev = document.title
    document.title = title.includes('Torxth') ? title : `${title} | Torxth Technology`

    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
    }
    upsertMeta('property', 'og:title', document.title)
    upsertMeta('property', 'og:type', 'website')
    if (image) upsertMeta('property', 'og:image', image)

    return () => {
      document.title = prev
    }
  }, [title, description, image])
}
