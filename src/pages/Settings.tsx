import { useState } from 'react'
import { Mail, Bell, Globe, Shield, Plus, Trash2, RefreshCw } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { mockGmailIntegrations } from '../data/mockData'
import type { GmailIntegration } from '../types'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [emailAccounts] = useState<GmailIntegration[]>(mockGmailIntegrations)
  const [currency, setCurrency] = useState('INR')
  const [reminderDays, setReminderDays] = useState(7)
  const [notifications, setNotifications] = useState({
    renewalReminders: true,
    priceChangeAlerts: true,
    budgetAlerts: false,
    frequency: 'weekly' as 'daily' | 'weekly' | 'none',
  })

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Manage your account, integrations, and preferences
        </p>
      </div>

      {/* Email Integrations */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Email Integrations</h2>
        </div>
        <div className="space-y-3">
          {emailAccounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{acc.email}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {acc.status === 'active' ? 'Connected' : 'Disconnected'}
                    {acc.lastSyncedAt && ` • Last synced: ${new Date(acc.lastSyncedAt).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors" title="Resync">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Disconnect">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-500 dark:text-slate-400 hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-700 dark:hover:text-primary-400 transition-colors">
            <Plus className="w-4 h-4" />
            Connect another Gmail account
          </button>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Renewal Reminders</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Get notified before subscriptions renew</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.renewalReminders}
              onChange={(e) => setNotifications({ ...notifications, renewalReminders: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>
          {notifications.renewalReminders && (
            <div className="ml-0 pl-4 border-l-2 border-gray-100 dark:border-slate-800">
              <label className="text-sm text-gray-600 dark:text-slate-400">
                Remind me
                <select
                  value={reminderDays}
                  onChange={(e) => setReminderDays(Number(e.target.value))}
                  className="mx-2 text-sm border border-gray-200 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                </select>
                before renewal
              </label>
            </div>
          )}
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Price Change Alerts</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Get notified when subscription prices change</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.priceChangeAlerts}
              onChange={(e) => setNotifications({ ...notifications, priceChangeAlerts: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Budget Alerts</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Alert when spending exceeds threshold</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.budgetAlerts}
              onChange={(e) => setNotifications({ ...notifications, budgetAlerts: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notification Frequency</p>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'none'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setNotifications({ ...notifications, frequency: freq })}
                  className={`px-4 py-2 text-sm rounded-lg font-medium capitalize transition-colors ${
                    notifications.frequency === freq
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Display Preferences */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Display Preferences</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 block w-full text-sm border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="INR">Indian Rupee (INR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">Theme</label>
            <div className="mt-1 flex gap-2">
              <button
                onClick={() => { if (theme === 'dark') toggleTheme() }}
                className={`flex-1 px-4 py-2.5 text-sm rounded-lg font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => { if (theme === 'light') toggleTheme() }}
                className={`flex-1 px-4 py-2.5 text-sm rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Data */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Privacy & Data</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40">
            <p className="font-medium text-emerald-700 dark:text-emerald-300">Privacy-First Approach</p>
            <p className="text-emerald-600 dark:text-emerald-400 mt-1">
              We only read email metadata (sender, subject, amounts). We never store full email content.
            </p>
          </div>
          <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            Download Your Data (GDPR)
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            Delete All Data
          </button>
        </div>
      </section>
    </div>
  )
}
