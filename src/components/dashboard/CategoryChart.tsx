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
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-44 h-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="cost"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
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
        <div className="w-full space-y-2">
          {data.map((item) => (
            <div key={item.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#94a3b8' }}
                />
                <span className="text-gray-600 dark:text-slate-400 truncate">{item.category}</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white shrink-0 ml-2">
                {formatCurrency(Math.round(item.cost))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
