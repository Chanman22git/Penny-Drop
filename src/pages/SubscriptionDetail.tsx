import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, ExternalLink, CreditCard, Calendar, Clock, Tag,
  Trash2, Pause, XCircle, Info, Zap
} from 'lucide-react'
import { useSubscriptions } from '../context/SubscriptionContext'
import { formatCurrency, formatDate, getMonthlyAmount, getYearlyAmount, cn } from '../lib/utils'
import StatusBadge from '../components/ui/StatusBadge'

export default function SubscriptionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { subscriptions, updateSubscription, deleteSubscription } = useSubscriptions()

  const sub = subscriptions.find((s) => s.id === id)

  if (!sub) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-slate-400">Subscription not found</p>
        <Link to="/" className="text-primary-600 text-sm mt-2 inline-block">Back to Dashboard</Link>
      </div>
    )
  }

  const ctx = sub.context

  function handleStatusChange(status: 'active' | 'paused' | 'cancelled') {
    updateSubscription(sub!.id, { status })
  }

  function handleDelete() {
    deleteSubscription(sub!.id)
    navigate('/')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-slate-300">
              {sub.serviceName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{sub.serviceName}</h1>
                <StatusBadge status={sub.status} />
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{sub.category}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(sub.amount)}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              per {sub.billingFrequency === 'monthly' ? 'month' : sub.billingFrequency === 'yearly' ? 'year' : 'quarter'}
            </p>
            {sub.billingFrequency !== 'monthly' && (
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                ({formatCurrency(Math.round(getMonthlyAmount(sub)))}/mo)
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Context Card */}
          {ctx && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">What is {sub.serviceName}?</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">{ctx.description}</p>

              {ctx.useCases.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Use Cases</p>
                  <div className="flex flex-wrap gap-2">
                    {ctx.useCases.map((uc) => (
                      <span key={uc} className="text-xs px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ctx.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Key Features</p>
                  <div className="flex flex-wrap gap-2">
                    {ctx.features.map((f) => (
                      <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ctx.website && (
                <a
                  href={`https://${ctx.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Visit {ctx.website} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Pricing Tiers */}
          {ctx && ctx.pricingTiers.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Pricing Plans</h2>
              <div className="space-y-2">
                {ctx.pricingTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      tier.price === sub.amount
                        ? 'border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20'
                        : 'border-gray-100 dark:border-slate-800'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{tier.name}</span>
                      {tier.price === sub.amount && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary-600 text-white">Current</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {tier.price === 0 ? 'Free' : formatCurrency(tier.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternatives */}
          {ctx && ctx.alternatives.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Alternatives</h2>
              <div className="space-y-2">
                {ctx.alternatives.map((alt) => (
                  <div key={alt.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800">
                    <span className="text-sm text-gray-700 dark:text-slate-300">{alt.name}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {alt.price === 0 ? 'Free' : formatCurrency(alt.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usage Analytics Placeholder */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Usage Analytics</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Coming Soon</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Usage tracking and cost-per-use metrics will be available in a future update.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Details */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Payment Method</p>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">
                    {sub.paymentMethod.type.replace('_', ' ')}
                    {sub.paymentMethod.lastFourDigits && ` ****${sub.paymentMethod.lastFourDigits}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Next Billing Date</p>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(sub.nextBillingDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Subscribed Since</p>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(sub.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Annual Cost</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(Math.round(getYearlyAmount(sub)))}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice History */}
          {sub.invoices.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Invoice History</h2>
              <div className="space-y-2">
                {sub.invoices.map((inv, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">{formatDate(inv.date)}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(inv.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Actions</h2>
            <div className="space-y-2">
              {sub.status === 'active' && (
                <button
                  onClick={() => handleStatusChange('paused')}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Pause className="w-4 h-4" /> Pause Subscription
                </button>
              )}
              {sub.status === 'paused' && (
                <button
                  onClick={() => handleStatusChange('active')}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 transition-colors"
                >
                  <Zap className="w-4 h-4" /> Resume Subscription
                </button>
              )}
              {sub.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 dark:text-amber-300 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Cancel Subscription
                </button>
              )}
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 dark:text-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete from App
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
