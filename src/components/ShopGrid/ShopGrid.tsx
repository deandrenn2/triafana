import './ShopGrid.css'
import { getPayload } from 'payload'
import config from '@payload-config'
import ProductCard from '@/app/(frontend)/Product/ProductCard/ProductCard'
import SortSelect from '../SortSelect/SortSelect'
import {
  filterProducts,
  type PriceRangeKey,
} from '@/lib/productFilters'

type Props = {
  category?: string
  subcategory?: string
  sort?: string
  search?: string
  price?: string
  size?: string
}

export async function ShopGrid({ category, subcategory, sort, search, price, size }: Props) {
  const payload = await getPayload({
    config,
  })

  const subcategorySlugs = (subcategory || '').split(',').filter(Boolean)

  let subcategoryIds: string[] = []
  if (subcategorySlugs.length > 0) {
    const result = await payload.find({
      collection: 'subcategories',
      limit: 100,
    })

    const bySlug: Record<string, string> = {}
    for (const sub of result.docs) {
      const slug = (sub as any).slug
      if (slug) bySlug[slug] = String(sub.id)
    }
    subcategoryIds = subcategorySlugs.map((slug) => bySlug[slug]).filter(Boolean)

    if (subcategoryIds.length === 0) {
      return (
        <div>
          <div className="shop-toolbar">
            <span>0 Productos</span>
            <SortSelect />
          </div>
          <div className="no-products">
            <h3>No hay productos</h3>
          </div>
        </div>
      )
    }
  }

  const where: any = {}
  if (category) {
    where.category = {
      equals: category.toLowerCase(),
    }
  }

  const products = await payload.find({
    collection: 'products',
    where,
    limit: 100,
    depth: 1,
  })

  const priceKeys = ((price || '').split(',').filter(Boolean) || []) as PriceRangeKey[]
  const cleanSearch = (search || '').trim()

  const docs = filterProducts(products.docs as any[], {
    subcategoryIds,
    priceKeys,
    size: size || null,
    sort: sort || '',
    search: cleanSearch,
  })

  return (
    <>
      <div className="shop-toolbar">
        <span>
          {cleanSearch.length > 0 ? (
            <>
              {docs.length} {docs.length === 1 ? 'resultado' : 'resultados'} para “
              {cleanSearch}”
            </>
          ) : (
            <>
              {docs.length} {docs.length === 1 ? 'Producto' : 'Productos'}
            </>
          )}
        </span>

        <SortSelect />
      </div>

      {docs.length > 0 ? (
        <div className="product-grid">
          {docs.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h3>No hay productos</h3>
          <p>
            {cleanSearch.length > 0
              ? `No encontramos nada para “${cleanSearch}”.`
              : 'No encontramos productos con esos filtros.'}
          </p>
        </div>
      )}
    </>
  )
}
