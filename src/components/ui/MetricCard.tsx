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
    <div className={cn('bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-4', className)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-500 dark:text-slate-400 leading-tight">{title}</p>
          <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            {icon}
          </div>
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-slate-500">{subtitle}</p>}
        {trend && (
          <p className={cn('text-xs font-medium', trend.positive ? 'text-emerald-600' : 'text-red-500')}>
            {trend.value}
          </p>
        )}
      </div>
    </div>
  )
}
