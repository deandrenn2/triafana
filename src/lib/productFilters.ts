export type PriceRangeKey = 'under100' | 'mid1' | 'mid2' | 'over'

export const PRICE_RANGES: { key: PriceRangeKey; label: string; test: (p: number) => boolean }[] = [
  { key: 'under100', label: 'Menos de $100.000', test: (p) => p < 100000 },
  { key: 'mid1', label: '$100.000 – $500.000', test: (p) => p >= 100000 && p <= 500000 },
  { key: 'mid2', label: '$500.000 – $1.500.000', test: (p) => p > 500000 && p <= 1500000 },
  { key: 'over', label: 'Más de $1.500.000', test: (p) => p > 1500000 },
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL']

/** El precio en BD es texto: se normaliza a número. */
export function parsePrice(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^0-9.-]/g, ''))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export type ProductFilters = {
  subcategoryIds: string[]
  priceKeys: PriceRangeKey[]
  size: string | null
  sort: string
  search: string
}

/** Búsqueda insensible a mayúsculas y tildes. */
export function matchesSearch(name: unknown, query: string): boolean {
  const clean = query.trim().toLowerCase()
  if (!clean) return true
  if (typeof name !== 'string') return false
  const normalized = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  const cleanQuery = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return normalized.includes(cleanQuery)
}

function productSubcategoryId(product: any): string {
  const sub = product?.subcategory
  if (sub == null) return ''
  if (typeof sub === 'object') return String(sub.id ?? '')
  return String(sub)
}

export function filterProducts(products: any[], filters: ProductFilters): any[] {
  const { subcategoryIds, priceKeys, size, sort, search } = filters

  const activeRanges = PRICE_RANGES.filter((r) => priceKeys.includes(r.key))

  let result = products.filter((p) => {
    if (subcategoryIds.length > 0 && !subcategoryIds.includes(productSubcategoryId(p))) {
      return false
    }
    if (activeRanges.length > 0) {
      const price = parsePrice(p.price)
      if (!activeRanges.some((r) => r.test(price))) return false
    }
    if (size) {
      const sizes: string[] = Array.isArray(p.sizes) ? p.sizes : []
      if (!sizes.includes(size)) return false
    }
    if (!matchesSearch(p.name, search)) return false
    return true
  })

  if (sort === 'asc' || sort === 'desc') {
    result = [...result].sort((a, b) => {
      const diff = parsePrice(a.price) - parsePrice(b.price)
      return sort === 'asc' ? diff : -diff
    })
  }

  return result
}
