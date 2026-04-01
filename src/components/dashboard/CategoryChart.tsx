import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useSubscriptions } from '../../context/SubscriptionContext'
import { getCategoryBreakdown, formatCurrency, CATEGORY_COLORS } from '../../lib/utils'

export default function CategoryChart() {
  const { subscriptions } = useSubscriptions()
  const data = getCategoryBreakdown(subscriptions)

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Cost by Category</h3>
        <p className="text-sm text-gray-500">No active subscriptions</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Cost by Category</h3>
      <div className="flex items-center gap-4">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="cost"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#94a3b8' }}
                />
                <span className="text-gray-600 dark:text-slate-400">{item.category}</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(Math.round(item.cost))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
