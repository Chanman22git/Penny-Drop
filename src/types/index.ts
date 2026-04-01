export type BillingFrequency = 'monthly' | 'yearly' | 'quarterly' | 'custom'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expiring'
export type SubscriptionCategory =
  | 'Productivity'
  | 'Streaming'
  | 'Cloud Storage'
  | 'Health & Fitness'
  | 'Learning'
  | 'Utilities'
  | 'Finance'
  | 'News & Content'
  | 'Software & Dev Tools'
  | 'Memberships'
  | 'Other'

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'upi' | 'bank_transfer' | 'other'
  lastFourDigits: string
  cardType?: string
}

export interface Invoice {
  date: string
  amount: number
  emailId?: string
}

export interface PricingTier {
  name: string
  price: number
  features?: string[]
}

export interface ServiceContext {
  description: string
  category: SubscriptionCategory
  logo?: string
  website: string
  useCases: string[]
  features: string[]
  pricingTiers: PricingTier[]
  alternatives: { name: string; price: number }[]
  reviewSummary?: string
}

export interface Subscription {
  id: string
  serviceName: string
  category: SubscriptionCategory
  amount: number
  currency: string
  billingFrequency: BillingFrequency
  nextBillingDate: string
  startDate: string
  status: SubscriptionStatus
  paymentMethod: PaymentMethod
  notes?: string
  sourceEmails?: string[]
  context?: ServiceContext
  invoices: Invoice[]
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  currency: string
  theme: 'light' | 'dark'
  timezone: string
  notificationFrequency: 'daily' | 'weekly' | 'none'
  renewalReminderDays: number
  language: string
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  preferences: UserPreferences
}

export interface GmailIntegration {
  id: string
  email: string
  lastSyncedAt: string | null
  status: 'active' | 'disconnected'
}
