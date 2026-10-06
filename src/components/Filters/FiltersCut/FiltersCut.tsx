import './filtersCut.css'
import { SIZES } from '@/lib/productFilters'

type Props = {
  value: string | null
  onChange: (size: string | null) => void
}

export const FiltersCut = ({ value, onChange }: Props) => {
  return (
    <div className="filters-cut">
      {SIZES.map((size) => (
        <button
          key={size}
          type="button"
          className={`filter-size ${value === size ? 'is-active' : ''}`}
          onClick={() => onChange(value === size ? null : size)}
        >
          {size}
        </button>
      ))}
    </div>
  )
}
