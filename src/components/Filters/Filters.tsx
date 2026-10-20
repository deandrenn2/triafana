'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import './filters.css'
import { FiltersCut } from './FiltersCut/FiltersCut'
import { PRICE_RANGES, type PriceRangeKey } from '@/lib/productFilters'

type Subcategory = {
  id: string
  name: string
  slug: string
  category: string
}

type FiltersProps = {
  category?: string
}

const readList = (params: URLSearchParams, key: string) =>
  params.get(key)?.split(',').filter(Boolean) || []

export default function Filters({ category }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(() =>
    readList(searchParams, 'subcategory'),
  )
  const [selectedPrices, setSelectedPrices] = useState<PriceRangeKey[]>(() =>
    readList(searchParams, 'price') as PriceRangeKey[],
  )
  const [selectedSize, setSelectedSize] = useState<string | null>(
    () => searchParams.get('size'),
  )

  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        let url = '/api/subcategories?limit=100'

        if (category) {
          url = `/api/subcategories?where[category][equals]=${category}&limit=100`
        }

        const res = await fetch(url, {
          cache: 'no-store',
        })

        if (!res.ok) {
          throw new Error('Error cargando subcategorías')
        }

        const data = await res.json()

        setSubcategories(data.docs)
      } catch (error) {
        console.error('Error:', error)
        setSubcategories([])
      }
    }

    loadSubcategories()
  }, [category])

  const syncToUrl = (next?: {
    subs?: string[]
    prices?: PriceRangeKey[]
    size?: string | null
  }) => {
    const subs = next?.subs ?? selectedSubcategories
    const prices = next?.prices ?? selectedPrices
    const size = next?.size !== undefined ? next.size : selectedSize

    const params = new URLSearchParams(searchParams.toString())

    if (subs.length > 0) {
      params.set('subcategory', subs.join(','))
    } else {
      params.delete('subcategory')
    }

    if (prices.length > 0) {
      params.set('price', prices.join(','))
    } else {
      params.delete('price')
    }

    if (size) {
      params.set('size', size)
    } else {
      params.delete('size')
    }

    const nextStr = params.toString()
    if (nextStr !== searchParams.toString()) {
      router.replace(`?${nextStr}`, { scroll: false })
    }
  }

  const handleApplyFilters = () => {
    syncToUrl()
  }

  const toggleSubcategory = (slug: string) => {
    const removing = selectedSubcategories.includes(slug)
    const updated = removing
      ? selectedSubcategories.filter((s) => s !== slug)
      : [...selectedSubcategories, slug]
    setSelectedSubcategories(updated)
    // Al desmarcar se aplica al instante; al marcar espera "Aplicar filtros"
    if (removing) syncToUrl({ subs: updated })
  }

  const togglePrice = (key: PriceRangeKey) => {
    const removing = selectedPrices.includes(key)
    const updated = removing
      ? selectedPrices.filter((k) => k !== key)
      : [...selectedPrices, key]
    setSelectedPrices(updated)
    if (removing) syncToUrl({ prices: updated })
  }

  const handleSizeChange = (next: string | null) => {
    setSelectedSize(next)
    // Al quitar la talla se aplica al instante; al elegir espera "Aplicar filtros"
    if (next === null) syncToUrl({ size: null })
  }

  return (
    <aside className="filters">
      <h3>Filtros</h3>
      <h4>Subcategoría</h4>

      <div className="sub-list">
        {subcategories.length > 0 ? (
          subcategories.map((subcategory) => (
            <label key={subcategory.id} className="filter-opt">
              <input
                type="checkbox"
                value={subcategory.slug}
                checked={selectedSubcategories.includes(subcategory.slug)}
                onChange={() => toggleSubcategory(subcategory.slug)}
              />

              {subcategory.name}
            </label>
          ))
        ) : (
          <p>No hay subcategorías.</p>
        )}
      </div>

      <div className="filter-group">
        <h4>Precio</h4>

        {PRICE_RANGES.map((range) => (
          <label key={range.key} className="filter-opt">
            <input
              type="checkbox"
              checked={selectedPrices.includes(range.key)}
              onChange={() => togglePrice(range.key)}
            />
            {range.label}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Tallas</h4>
        <FiltersCut value={selectedSize} onChange={handleSizeChange} />
      </div>

      <button type="button" className="btn btn-teal btn-block" onClick={handleApplyFilters}>
        Aplicar filtros
      </button>
    </aside>
  )
}
