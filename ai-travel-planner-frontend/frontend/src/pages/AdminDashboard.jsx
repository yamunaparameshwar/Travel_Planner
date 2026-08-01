import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { Users, Map, MessageSquare, Star, ShieldCheck } from 'lucide-react'
import StatCard from '../components/cards/StatCard'

const ACTIVITY_DATA = [
  { month: 'Feb', trips: 320 }, { month: 'Mar', trips: 410 }, { month: 'Apr', trips: 380 },
  { month: 'May', trips: 520 }, { month: 'Jun', trips: 610 }, { month: 'Jul', trips: 690 },
]

const TABS = ['Users', 'Trips', 'Destinations', 'Reviews', 'Messages']

const MOCK_ROWS = {
  Users: [{ id: 1, name: 'Priya Nair', email: 'priya@example.com', joined: '2026-01-04' }, { id: 2, name: 'Marco Diaz', email: 'marco@example.com', joined: '2026-02-19' }],
  Trips: [{ id: 1, user: 'Priya Nair', destination: 'Manali', status: 'Upcoming' }, { id: 2, user: 'Marco Diaz', destination: 'Lisbon', status: 'Completed' }],
  Destinations: [{ id: 1, name: 'Kyoto', country: 'Japan', rating: 4.8 }, { id: 2, name: 'Santorini', country: 'Greece', rating: 4.9 }],
  Reviews: [{ id: 1, user: 'Aiko T.', destination: 'Kyoto', rating: 5 }, { id: 2, user: 'Marco D.', destination: 'Lisbon', rating: 4 }],
  Messages: [{ id: 1, name: 'Sam Lee', subject: 'Partnership inquiry', received: '2026-07-10' }],
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('Users')
  const rows = MOCK_ROWS[tab]
  const columns = Object.keys(rows[0]).filter((k) => k !== 'id')

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-horizon-500" size={22} />
        <h1 className="font-display text-2xl font-bold text-ink dark:text-sand">Admin dashboard</h1>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total users" value="8,240" />
        <StatCard icon={Map} label="Active trips" value="1,120" accent="sunset" />
        <StatCard icon={Star} label="Avg rating" value="4.8" />
        <StatCard icon={MessageSquare} label="New messages" value="14" accent="sunset" />
      </div>

      <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
        <p className="font-display font-bold text-ink dark:text-sand">Trips planned per month</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ACTIVITY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Bar dataKey="trips" radius={[6, 6, 0, 0]} fill="#0E7490" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex gap-2 overflow-x-auto border-b border-ink/10 dark:border-white/10">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${
                tab === t ? 'border-b-2 border-sunset-500 text-sunset-500' : 'text-ink/50 dark:text-sand-300/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand-200 text-ink/60 dark:bg-ink-700 dark:text-sand-300/70">
              <tr>
                {columns.map((c) => <th key={c} className="whitespace-nowrap px-4 py-3 font-medium capitalize">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-ink/10 dark:border-white/10">
                  {columns.map((c) => <td key={c} className="whitespace-nowrap px-4 py-3 text-ink dark:text-sand">{row[c]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
