import { useEffect, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Wallet, Hotel, Utensils, Bus, Ticket, PlusCircle, ShieldAlert } from 'lucide-react'
import { budgetService } from '../api/trips'

const COLORS = ['#0E7490', '#F4623A', '#7FC7CB', '#FF8A65', '#0B5D74', '#93A5B8']
const HOTEL_RATE = { Budget: 30, Standard: 70, Luxury: 180 }

export default function BudgetCalculator() {
  const [days, setDays] = useState(5)
  const [travelers, setTravelers] = useState(2)
  const [hotelTier, setHotelTier] = useState('Standard')
  const [foodPerDay, setFoodPerDay] = useState(35)
  const [travelCost, setTravelCost] = useState(400)
  const [tickets, setTickets] = useState(150)
  const [misc, setMisc] = useState(100)

  const [apiResult, setApiResult] = useState(null)

  useEffect(() => {
    budgetService.calculate({
      days,
      travelers,
      hotel_tier: hotelTier,
      food_per_day: foodPerDay,
      travel_cost: travelCost,
      tickets,
      misc,
    }).then(({ data }) => setApiResult(data))
      .catch(() => setApiResult(null))
  }, [days, travelers, hotelTier, foodPerDay, travelCost, tickets, misc])

  const breakdown = useMemo(() => {
    if (apiResult) {
      const hotel = Number(apiResult.hotel_cost)
      const food = Number(apiResult.food_cost)
      const travel = Number(apiResult.travel_cost)
      const entry = Number(apiResult.entry_tickets)
      const m = Number(apiResult.miscellaneous)
      const gst = Number(apiResult.gst)
      const emergency = Number(apiResult.emergency_fund)
      const total = Number(apiResult.total)
      return {
        hotel, food, travel, entry, misc: m, gst, emergency, total,
        chart: [
          { name: 'Hotel', value: Math.round(hotel) },
          { name: 'Food', value: Math.round(food) },
          { name: 'Travel', value: Math.round(travel) },
          { name: 'Entry Tickets', value: Math.round(entry) },
          { name: 'Misc', value: Math.round(m) },
          { name: 'GST + Emergency', value: Math.round(gst + emergency) },
        ],
      }
    }

    const hotel = HOTEL_RATE[hotelTier] * days
    const food = foodPerDay * days * travelers
    const travel = travelCost * travelers
    const entry = tickets * travelers
    const subtotal = hotel + food + travel + entry + misc
    const gst = subtotal * 0.05
    const emergency = subtotal * 0.1
    const total = subtotal + gst + emergency

    return {
      hotel, food, travel, entry, misc, gst, emergency, total,
      chart: [
        { name: 'Hotel', value: Math.round(hotel) },
        { name: 'Food', value: Math.round(food) },
        { name: 'Travel', value: Math.round(travel) },
        { name: 'Entry Tickets', value: Math.round(entry) },
        { name: 'Misc', value: Math.round(misc) },
        { name: 'GST + Emergency', value: Math.round(gst + emergency) },
      ],
    }
  }, [apiResult, days, travelers, hotelTier, foodPerDay, travelCost, tickets, misc])

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-sand">Budget calculator</h1>
      <p className="mt-2 text-ink/60 dark:text-sand-300/70">Adjust the inputs — hotel, food, transport, and GST update live.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5 rounded-2xl border border-ink/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
          <NumberInput icon={Wallet} label="Days" value={days} onChange={setDays} min={1} />
          <NumberInput icon={Wallet} label="Travelers" value={travelers} onChange={setTravelers} min={1} />

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink dark:text-sand">
              <Hotel size={15} /> Hotel preference
            </label>
            <div className="flex gap-2">
              {Object.keys(HOTEL_RATE).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setHotelTier(tier)}
                  className={`flex-1 rounded-xl border py-2 text-sm font-medium transition ${
                    hotelTier === tier
                      ? 'border-horizon-500 bg-horizon-50 text-horizon-600 dark:bg-white/5 dark:text-horizon-300'
                      : 'border-ink/10 text-ink/60 dark:border-white/15 dark:text-sand-300'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <NumberInput icon={Utensils} label="Food / day / traveler ($)" value={foodPerDay} onChange={setFoodPerDay} min={0} />
          <NumberInput icon={Bus} label="Travel cost / traveler ($)" value={travelCost} onChange={setTravelCost} min={0} />
          <NumberInput icon={Ticket} label="Entry tickets / traveler ($)" value={tickets} onChange={setTickets} min={0} />
          <NumberInput icon={PlusCircle} label="Miscellaneous ($)" value={misc} onChange={setMisc} min={0} />

          <p className="flex items-center gap-1.5 text-xs text-ink/50 dark:text-sand-300/60">
            <ShieldAlert size={13} /> Includes 5% GST and a 10% emergency buffer automatically.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-ink/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
            <p className="text-sm text-ink/50 dark:text-sand-300/60">Estimated total</p>
            <p className="mt-1 font-display text-4xl font-bold text-ink dark:text-sand">${breakdown.total.toFixed(0)}</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown.chart} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {breakdown.chart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} formatter={(v) => `$${v}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {breakdown.chart.map((c, i) => (
                <div key={c.name} className="flex items-center gap-1.5 text-ink/60 dark:text-sand-300/70">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {c.name}: ${c.value}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
            <p className="text-sm font-semibold text-ink dark:text-sand">Cost by category</p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdown.chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} formatter={(v) => `$${v}`} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#0E7490" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NumberInput({ icon: Icon, label, value, onChange, min = 0 }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink dark:text-sand">
        <Icon size={15} /> {label}
      </label>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value)))}
        className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-horizon-500 dark:border-white/15 dark:text-sand"
      />
    </div>
  )
}
