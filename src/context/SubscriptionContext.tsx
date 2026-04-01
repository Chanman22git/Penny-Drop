import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Subscription } from '../types'
import { mockSubscriptions } from '../data/mockData'

interface SubscriptionContextType {
  subscriptions: Subscription[]
  loading: boolean
  updateSubscription: (id: string, updates: Partial<Subscription>) => void
  deleteSubscription: (id: string) => void
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [loading] = useState(false)

  function updateSubscription(id: string, updates: Partial<Subscription>) {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s))
    )
  }

  function deleteSubscription(id: string) {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <SubscriptionContext.Provider value={{ subscriptions, loading, updateSubscription, deleteSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionProvider')
  return ctx
}
