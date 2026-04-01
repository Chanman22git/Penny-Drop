import { format, formatDistanceToNow, isWithinInterval, addDays } from 'date-fns'
import type { Subscription, SubscriptionCategory } from '../types'

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM dd, yyyy')
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function getMonthlyAmount(sub: Subscription): number {
  switch (sub.billingFrequency) {
    case 'yearly':
      return sub.amount / 12
    case 'quarterly':
      return sub.amount / 3
    default:
      return sub.amount
  }
}

export function getYearlyAmount(sub: Subscription): number {
  switch (sub.billingFrequency) {
    case 'monthly':
      return sub.amount * 12
    case 'quarterly':
      return sub.amount * 4
    default:
      return sub.amount
  }
}

export function getUpcomingRenewals(subs: Subscription[], days = 7): Subscription[] {
  const now = new Date()
  const end = addDays(now, days)
  return subs
    .filter(
      (s) =>
        s.status === 'active' &&
        isWithinInterval(new Date(s.nextBillingDate), { start: now, end })
    )
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
}

export function getTotalMonthly(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + getMonthlyAmount(s), 0)
}

export function getTotalYearly(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + getYearlyAmount(s), 0)
}

export function getCategoryBreakdown(
  subs: Subscription[]
): { category: SubscriptionCategory; count: number; cost: number }[] {
  const map = new Map<SubscriptionCategory, { count: number; cost: number }>()
  for (const s of subs.filter((s) => s.status === 'active')) {
    const existing = map.get(s.category) || { count: 0, cost: 0 }
    map.set(s.category, {
      count: existing.count + 1,
      cost: existing.cost + getMonthlyAmount(s),
    })
  }
  return Array.from(map.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.cost - a.cost)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700'
    case 'expiring':
      return 'bg-amber-100 text-amber-700'
    case 'cancelled':
      return 'bg-gray-100 text-gray-500'
    case 'paused':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-500'
  }
}

export const CATEGORY_COLORS: Record<string, string> = {
  Productivity: '#6366f1',
  Streaming: '#f43f5e',
  'Cloud Storage': '#06b6d4',
  'Health & Fitness': '#10b981',
  Learning: '#f59e0b',
  Utilities: '#8b5cf6',
  Finance: '#14b8a6',
  'News & Content': '#ec4899',
  'Software & Dev Tools': '#3b82f6',
  Memberships: '#f97316',
  Other: '#94a3b8',
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
