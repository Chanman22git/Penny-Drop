import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Mail, Loader2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

type Step = 'welcome' | 'connect' | 'processing' | 'review' | 'done'

export default function Onboarding() {
  const [step, setStep] = useState<Step>('welcome')
  const navigate = useNavigate()

  function handleConnect() {
    setStep('processing')
    // Simulate processing
    setTimeout(() => setStep('review'), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['welcome', 'connect', 'processing', 'review'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  (['welcome', 'connect', 'processing', 'review'] as Step[]).indexOf(step) >= i
                    ? 'bg-primary-600'
                    : 'bg-gray-300 dark:bg-slate-600'
                }`}
              />
              {i < 3 && <div className="w-8 h-px bg-gray-300 dark:bg-slate-600" />}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 shadow-sm">
          {step === 'welcome' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to Penny Drop
              </h1>
              <p className="text-gray-500 dark:text-slate-400 mb-6">
                Discover all your subscriptions, understand what you're paying for, and take control of your recurring expenses.
              </p>
              <div className="space-y-3 text-left mb-8">
                {[
                  'Automatically discover subscriptions from Gmail',
                  'Get rich context about each service',
                  'Track costs and upcoming renewals',
                  'Make informed cancellation decisions',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep('connect')}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'connect' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect Your Gmail</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                We'll scan your emails for invoices and receipts to discover your subscriptions automatically.
              </p>
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 mb-6 text-left">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Privacy Guarantee</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  Read-only access. We only extract billing metadata — never full email content.
                </p>
              </div>
              <button
                onClick={handleConnect}
                className="w-full py-3 px-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-xl font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>
              <button
                onClick={() => setStep('review')}
                className="mt-3 text-sm text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              >
                Skip for now — I'll add subscriptions manually
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Scanning Your Emails</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                Looking for invoices, receipts, and subscription confirmations...
              </p>
              <div className="space-y-2 text-sm text-left max-w-xs mx-auto">
                {[
                  { text: 'Connecting to Gmail...', done: true },
                  { text: 'Scanning last 6 months...', done: true },
                  { text: 'Extracting subscription data...', done: false },
                  { text: 'Categorizing services...', done: false },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    )}
                    <span className={item.done ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                14 Subscriptions Found!
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                We discovered your recurring subscriptions. You can review and edit them on the dashboard.
              </p>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">14</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Subscriptions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">~7,500/mo</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Est. Monthly Cost</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
