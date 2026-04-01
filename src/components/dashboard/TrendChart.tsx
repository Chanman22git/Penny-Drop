import { useState, useMemo } from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { subMonths, startOfMonth } from 'date-fns'
import { useSubscriptions } from '../../context/SubscriptionContext'
import { generateTrendData, formatCurrency, cn } from '../../lib/utils'

type Range = '3M' | '6M' | '1Y' | 'All'

const RANGES: Range[] = ['3M', '6M', '1Y', 'All']

function getRangeStart(range: Range, trackingStart: Date): Date {
  const now = new Date()
  switch (range) {
    case '3M': return subMonths(now, 3)
    case '6M': return subMonths(now, 6)
    case '1Y': return subMonths(now, 12)
    case 'All': return trackingStart
  }
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const cost = payload.find((p: any) => p.dataKey === 'cost')?.value ?? 0
  const count = payload.find((p: any) => p.dataKey === 'count')?.value ?? 0
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-gray-700 dark:text-slate-200 mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-primary-500 inline-block" />
            Monthly cost
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(cost)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Subscriptions
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
        </div>
      </div>
    </div>
  )
}

export default function TrendChart() {
  const { subscriptions } = useSubscriptions()
  const [range, setRange] = useState<Range>('6M')

  const trackingStart = useMemo(() => {
    const saved = localStorage.getItem('penny-drop-tracking-start')
    if (saved) return startOfMonth(new Date(saved))
    return subMonths(new Date(), 6)
  }, [])

  const data = useMemo(() => {
    const from = getRangeStart(range, trackingStart)
    return generateTrendData(subscriptions, from, new Date())
  }, [subscriptions, range, trackingStart])

  // Delta stats vs first data point
  const first = data[0]
  const last = data[data.length - 1]
  const costDelta = first && last ? last.cost - first.cost : 0
  const countDelta = first && last ? last.count - first.count : 0

  function DeltaBadge({ value, prefix = '' }: { value: number; prefix?: string }) {
    if (value === 0) return <span className="flex items-center gap-0.5 text-gray-400"><Minus className="w-3 h-3" /> No change</span>
    const up = value > 0
    return (
      <span className={cn('flex items-center gap-0.5 font-medium', up ? 'text-red-500' : 'text-emerald-500')}>
        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {up ? '+' : ''}{prefix}{Math.abs(value).toLocaleString()}
      </span>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Spend & Subscription Trend</h3>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">How your subscriptions have grown over time</p>
        </div>
        {/* Range selector */}
        <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 shrink-0">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-all',
                range === r
                  ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Delta pills */}
      <div className="flex gap-4 mb-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 dark:text-slate-500">Cost change</span>
          <DeltaBadge value={costDelta} prefix="₹" />
        </div>
        <div className="w-px bg-gray-100 dark:bg-slate-800" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 dark:text-slate-500">Subscriptions change</span>
          <DeltaBadge value={countDelta} />
        </div>
      </div>

      {/* Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            {/* Left Y: cost */}
            <YAxis
              yAxisId="cost"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
            />
            {/* Right Y: count */}
            <YAxis
              yAxisId="count"
              orientation="right"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="cost"
              type="monotone"
              dataKey="cost"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#costGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#6366f1' }}
            />
            <Line
              yAxisId="count"
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0, fill: '#10b981' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 justify-center">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
          <span className="w-3 h-0.5 bg-primary-500 rounded inline-block" />
          Monthly cost
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
          <span className="w-3 h-0.5 bg-emerald-500 rounded inline-block" />
          No. of subscriptions
        </div>
      </div>
    </div>
  )
}
