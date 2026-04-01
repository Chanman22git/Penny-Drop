import { CalendarClock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSubscriptions } from '../../context/SubscriptionContext'
import { getUpcomingRenewals, formatCurrency, formatDate } from '../../lib/utils'
import StatusBadge from '../ui/StatusBadge'

export default function RenewalWidget() {
  const { subscriptions } = useSubscriptions()
  const upcoming = getUpcomingRenewals(subscriptions, 30)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Upcoming Renewals</h3>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">No renewals in the next 30 days</p>
      ) : (
        <div className="space-y-3">
          {upcoming.slice(0, 5).map((sub) => (
            <Link
              key={sub.id}
              to={`/subscription/${sub.id}`}
              className="flex items-center justify-between py-2 px-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.serviceName}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{formatDate(sub.nextBillingDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(sub.amount)}</p>
                <StatusBadge status={sub.status} />
              </div>
            </Link>
          ))}
          {upcoming.length > 5 && (
            <p className="text-xs text-gray-500 dark:text-slate-400 text-center pt-1">
              +{upcoming.length - 5} more renewals
            </p>
          )}
        </div>
      )}
    </div>
  )
}
