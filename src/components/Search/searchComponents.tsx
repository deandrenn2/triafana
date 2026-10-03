'use client'
import './searchComponents.css'
import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  onNavigate?: () => void
}

export const SearchComponents = ({ onNavigate }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = query.trim()
    if (!clean) return
    onNavigate?.()
    router.push(`/store?search=${encodeURIComponent(clean)}`)
  }

  const handleChange = (value: string) => {
    setQuery(value)
    if (value.trim() === '' && searchParams.get('search')) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('search')
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    }
  }

  return (
    <form className="search-components" onSubmit={handleSubmit} role="search">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Buscar productos, marcas"
        aria-label="Buscar productos"
      />
    </form>
  )
}
