import { IndianRupee, CreditCard, CalendarClock, TrendingUp } from 'lucide-react'
import { useSubscriptions } from '../context/SubscriptionContext'
import { formatCurrency, getTotalMonthly, getTotalYearly, getUpcomingRenewals } from '../lib/utils'
import MetricCard from '../components/ui/MetricCard'
import CategoryChart from '../components/dashboard/CategoryChart'
import RenewalWidget from '../components/dashboard/RenewalWidget'
import SubscriptionTable from '../components/dashboard/SubscriptionTable'

export default function Dashboard() {
  const { subscriptions } = useSubscriptions()

  const activeCount = subscriptions.filter((s) => s.status === 'active').length
  const totalMonthly = getTotalMonthly(subscriptions)
  const totalYearly = getTotalYearly(subscriptions)
  const upcomingCount = getUpcomingRenewals(subscriptions, 7).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Track and manage all your subscriptions in one place
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monthly Spend"
          value={formatCurrency(Math.round(totalMonthly))}
          icon={<IndianRupee className="w-5 h-5" />}
        />
        <MetricCard
          title="Yearly Spend"
          value={formatCurrency(Math.round(totalYearly))}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          title="Active Subscriptions"
          value={activeCount}
          subtitle={`${subscriptions.length} total`}
          icon={<CreditCard className="w-5 h-5" />}
        />
        <MetricCard
          title="Renewals This Week"
          value={upcomingCount}
          subtitle="Next 7 days"
          icon={<CalendarClock className="w-5 h-5" />}
        />
      </div>

      {/* Charts & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CategoryChart />
        </div>
        <RenewalWidget />
      </div>

      {/* Subscription Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">All Subscriptions</h2>
        <SubscriptionTable />
      </div>
    </div>
  )
}
