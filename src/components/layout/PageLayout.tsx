import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Sidebar />
      {/* pt-14 accounts for mobile top header; pb-20 for bottom nav + safe area */}
      <main className="md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {children}
        </div>
      </main>
    </div>
  )
}
