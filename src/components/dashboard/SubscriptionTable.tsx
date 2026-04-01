import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpDown, ChevronRight } from 'lucide-react'
import { useSubscriptions } from '../../context/SubscriptionContext'
import { formatCurrency, formatDate, getMonthlyAmount, cn } from '../../lib/utils'
import StatusBadge from '../ui/StatusBadge'
import type { Subscription, SubscriptionCategory, SubscriptionStatus } from '../../types'

type SortKey = 'cost' | 'name' | 'date' | 'category'
type SortDir = 'asc' | 'desc'

export default function SubscriptionTable() {
  const { subscriptions } = useSubscriptions()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('cost')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filterCategory, setFilterCategory] = useState<SubscriptionCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<SubscriptionStatus | 'all'>('all')

  const categories = useMemo(() => {
    const cats = new Set(subscriptions.map((s) => s.category))
    return Array.from(cats).sort()
  }, [subscriptions])

  const filtered = useMemo(() => {
    let result = subscriptions

    if (search) {
      const q = search.toLowerCase()
      result = result.filter((s) => s.serviceName.toLowerCase().includes(q))
    }
    if (filterCategory !== 'all') {
      result = result.filter((s) => s.category === filterCategory)
    }
    if (filterStatus !== 'all') {
      result = result.filter((s) => s.status === filterStatus)
    }

    const comparators: Record<SortKey, (a: Subscription, b: Subscription) => number> = {
      cost: (a, b) => getMonthlyAmount(a) - getMonthlyAmount(b),
      name: (a, b) => a.serviceName.localeCompare(b.serviceName),
      date: (a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime(),
      category: (a, b) => a.category.localeCompare(b.category),
    }

    result = [...result].sort((a, b) => {
      const cmp = comparators[sortKey](a, b)
      return sortDir === 'desc' ? -cmp : cmp
    })

    return result
  }, [subscriptions, search, sortKey, sortDir, filterCategory, filterStatus])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as SubscriptionCategory | 'all')}
              className="text-sm border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as SubscriptionStatus | 'all')}
              className="text-sm border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring</option>
              <option value="cancelled">Cancelled</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-800">
              {[
                { key: 'name' as SortKey, label: 'Service' },
                { key: 'category' as SortKey, label: 'Category' },
                { key: 'cost' as SortKey, label: 'Cost/mo' },
                { key: 'date' as SortKey, label: 'Next Renewal' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-slate-200"
                  onClick={() => toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className={cn('w-3 h-3', sortKey === col.key && 'text-primary-600')} />
                  </div>
                </th>
              ))}
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {filtered.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3">
                  <Link to={`/subscription/${sub.id}`} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-slate-300">
                      {sub.serviceName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{sub.serviceName}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-slate-400">{sub.category}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(Math.round(getMonthlyAmount(sub)))}
                  {sub.billingFrequency !== 'monthly' && (
                    <span className="text-xs font-normal text-gray-400 dark:text-slate-500 ml-1">
                      ({formatCurrency(sub.amount)}/{sub.billingFrequency === 'yearly' ? 'yr' : 'qtr'})
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-slate-400">
                  {formatDate(sub.nextBillingDate)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={sub.status} />
                </td>
                <td className="px-4 py-3">
                  <Link to={`/subscription/${sub.id}`} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500 dark:text-slate-400">
            No subscriptions found
          </div>
        )}
      </div>
    </div>
  )
}
