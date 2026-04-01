import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: { value: string; positive: boolean }
  className?: string
}

export default function MetricCard({ title, value, subtitle, icon, trend, className }: MetricCardProps) {
  return (
    <div className={cn('bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-500">{subtitle}</p>}
          {trend && (
            <p className={cn('mt-1 text-xs font-medium', trend.positive ? 'text-emerald-600' : 'text-red-500')}>
              {trend.value}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
          {icon}
        </div>
      </div>
    </div>
  )
}
