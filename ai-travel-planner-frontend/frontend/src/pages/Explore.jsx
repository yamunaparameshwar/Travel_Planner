import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, MapPinOff } from 'lucide-react'
import { destinations as fallbackDestinations, CATEGORIES } from '../data/destinations'
import { destinationService } from '../api/destinations'
import DestinationCard from '../components/cards/DestinationCard'
import EmptyState from '../components/common/EmptyState'

const PAGE_SIZE = 6

const normalizeDestination = (d) => ({
  ...d,
  id: d.id,
  name: d.name,
  country: d.country,
  state: d.state || '',
  category: d.category,
  description: d.description || '',
  image: d.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  rating: d.rating || 4.5,
  reviews: d.reviews_count || d.reviews || 0,
  avgBudget: d.avg_budget !== undefined ? Number(d.avg_budget) : (d.avgBudget || 1000),
  bestSeason: d.best_season || d.bestSeason || 'All Year',
  weather: d.weather || 'Pleasant',
  lat: d.latitude !== undefined ? d.latitude : d.lat,
  lng: d.longitude !== undefined ? d.longitude : d.lng,
})

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || 'All')
  const [sort, setSort] = useState('rating')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState(fallbackDestinations.map(normalizeDestination))

  useEffect(() => {
    destinationService.list()
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.results || []
        if (list.length > 0) {
          setItems(list.map(normalizeDestination))
        }
      })
      .catch(() => {/* keep fallback */})
  }, [])

  const filtered = useMemo(() => {
    let list = items.filter((d) => {
      const matchesQuery = `${d.name} ${d.country}`.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || d.category === category
      return matchesQuery && matchesCategory
    })
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'budget-low') list = [...list].sort((a, b) => a.avgBudget - b.avgBudget)
    if (sort === 'budget-high') list = [...list].sort((a, b) => b.avgBudget - a.avgBudget)
    return list
  }, [items, query, category, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-sand">Explore destinations</h1>
      <p className="mt-2 text-ink/60 dark:text-sand-300/70">Search, filter, and sort {items.length}+ curated places.</p>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 dark:border-white/10 dark:bg-ink-800 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-ink/10 px-3 py-2 dark:border-white/15">
          <Search size={16} className="text-ink/40" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
              setParams((p) => { p.set('q', e.target.value); return p })
            }}
            placeholder="Search destination or country"
            className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
          />
        </div>

        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1) }}
          className="rounded-xl border border-ink/10 bg-transparent px-3 py-2 text-sm text-ink dark:border-white/15 dark:text-sand"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex items-center gap-2 rounded-xl border border-ink/10 px-3 py-2 dark:border-white/15">
          <SlidersHorizontal size={15} className="text-ink/40" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-sm text-ink outline-none dark:text-sand"
          >
            <option value="rating">Top rated</option>
            <option value="budget-low">Budget: low to high</option>
            <option value="budget-high">Budget: high to low</option>
          </select>
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={MapPinOff} title="No destinations match" description="Try a different search term or category." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((d) => <DestinationCard key={d.id} destination={d} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-full text-sm font-medium transition ${
                page === i + 1 ? 'bg-horizon-gradient text-white' : 'border border-ink/10 text-ink/60 dark:border-white/15 dark:text-sand-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
