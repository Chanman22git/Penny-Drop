import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard, CheckCircle2, ArrowRight, ArrowLeft,
  Loader2, Sparkles, Calendar, RefreshCw, Search,
  Tv, Briefcase, Cloud, Heart, BookOpen, Shield, Landmark, Newspaper, Code2, Users
} from 'lucide-react'
import { cn } from '../lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type Step =
  | 'welcome'
  | 'profile'
  | 'gmail'
  | 'preferences'
  | 'invoice-types'
  | 'scanning'
  | 'review'
  | 'processing'

interface FormData {
  name: string
  gmailConnected: boolean
  gmailEmail: string
  trackingStartDate: string
  checkFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  invoiceCategories: string[]
  confirmedIds: string[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INVOICE_CATEGORIES = [
  { id: 'streaming', label: 'Streaming & Entertainment', icon: Tv, desc: 'Netflix, Spotify, YouTube' },
  { id: 'productivity', label: 'Productivity & SaaS', icon: Briefcase, desc: 'Notion, Figma, Adobe' },
  { id: 'cloud', label: 'Cloud Storage', icon: Cloud, desc: 'Google Drive, Dropbox' },
  { id: 'health', label: 'Health & Fitness', icon: Heart, desc: 'Gym, Calm, Headspace' },
  { id: 'learning', label: 'Learning & Courses', icon: BookOpen, desc: 'Coursera, Udemy' },
  { id: 'utilities', label: 'Utilities & VPN', icon: Shield, desc: 'NordVPN, Antivirus' },
  { id: 'finance', label: 'Financial Services', icon: Landmark, desc: 'Trading apps, fintech' },
  { id: 'news', label: 'News & Content', icon: Newspaper, desc: 'Medium, Substack' },
  { id: 'dev', label: 'Dev Tools', icon: Code2, desc: 'GitHub, Vercel, AWS' },
  { id: 'memberships', label: 'Memberships', icon: Users, desc: 'Amazon Prime, clubs' },
]

const FREQUENCIES = [
  { value: 'daily', label: 'Daily', desc: 'Every day' },
  { value: 'weekly', label: 'Weekly', desc: 'Every week' },
  { value: 'biweekly', label: 'Bi-weekly', desc: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly', desc: 'Once a month' },
] as const

const DISCOVERED_SUBS = [
  { id: 'sub_001', name: 'Netflix', category: 'Streaming', amount: 649, color: '#e50914' },
  { id: 'sub_002', name: 'Spotify Premium', category: 'Streaming', amount: 119, color: '#1db954' },
  { id: 'sub_003', name: 'Adobe Creative Cloud', category: 'Productivity', amount: 4999, color: '#ff0000' },
  { id: 'sub_004', name: 'Notion', category: 'Productivity', amount: 800, color: '#000000' },
  { id: 'sub_005', name: 'GitHub Pro', category: 'Dev Tools', amount: 340, color: '#24292f' },
  { id: 'sub_006', name: 'Amazon Prime', category: 'Memberships', amount: 125, color: '#ff9900' },
  { id: 'sub_007', name: 'Google One', category: 'Cloud Storage', amount: 108, color: '#4285f4' },
  { id: 'sub_008', name: 'Figma', category: 'Productivity', amount: 0, color: '#f24e1e' },
  { id: 'sub_009', name: 'NordVPN', category: 'Utilities', amount: 267, color: '#4687ff' },
  { id: 'sub_010', name: 'Coursera Plus', category: 'Learning', amount: 2793, color: '#0056d2' },
  { id: 'sub_011', name: 'YouTube Premium', category: 'Streaming', amount: 149, color: '#ff0000' },
  { id: 'sub_012', name: 'Headspace', category: 'Health & Fitness', amount: 499, color: '#f47d31' },
  { id: 'sub_013', name: 'Medium', category: 'News & Content', amount: 450, color: '#000000' },
  { id: 'sub_014', name: 'Zerodha', category: 'Finance', amount: 200, color: '#387ed1' },
]

const PROCESSING_PHASES = [
  'Categorising your subscriptions...',
  'Calculating monthly spend...',
  'Setting up renewal alerts...',
  'Personalising your dashboard...',
  'Almost there...',
]

const SETUP_STEPS: Step[] = ['profile', 'gmail', 'preferences', 'invoice-types']

// ─── Main component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('welcome')
  const [form, setForm] = useState<FormData>({
    name: '',
    gmailConnected: false,
    gmailEmail: '',
    trackingStartDate: monthsAgo(6),
    checkFrequency: 'weekly',
    invoiceCategories: INVOICE_CATEGORIES.map((c) => c.id),
    confirmedIds: DISCOVERED_SUBS.map((s) => s.id),
  })

  function next(nextStep: Step) {
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function complete() {
    localStorage.setItem('penny-drop-onboarded', 'true')
    localStorage.setItem('penny-drop-user-name', form.name)
    navigate('/')
  }

  const progressIdx = SETUP_STEPS.indexOf(step)
  const showProgress = progressIdx !== -1

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      {/* Top progress bar */}
      {showProgress && (
        <div className="fixed top-0 inset-x-0 z-50">
          <div className="h-1 bg-gray-200 dark:bg-slate-800">
            <div
              className="h-full bg-primary-500 transition-all duration-500"
              style={{ width: `${((progressIdx + 1) / SETUP_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-start p-4 py-8 pt-10">
        <div className={cn('w-full', step === 'welcome' ? 'max-w-sm' : 'max-w-md')}>
          {step === 'welcome' && <WelcomeStep onNext={() => next('profile')} />}
          {step === 'profile' && (
            <ProfileStep form={form} setForm={setForm} onBack={() => next('welcome')} onNext={() => next('gmail')} />
          )}
          {step === 'gmail' && (
            <GmailStep form={form} setForm={setForm} onBack={() => next('profile')} onNext={() => next('preferences')} />
          )}
          {step === 'preferences' && (
            <PreferencesStep form={form} setForm={setForm} onBack={() => next('gmail')} onNext={() => next('invoice-types')} />
          )}
          {step === 'invoice-types' && (
            <InvoiceTypesStep form={form} setForm={setForm} onBack={() => next('preferences')} onNext={() => next('scanning')} />
          )}
          {step === 'scanning' && (
            <ScanningStep name={form.name} onDone={() => next('review')} />
          )}
          {step === 'review' && (
            <ReviewStep form={form} setForm={setForm} onBack={() => next('invoice-types')} onNext={() => next('processing')} />
          )}
          {step === 'processing' && <ProcessingStep onDone={complete} />}
        </div>
      </div>
    </div>
  )
}

// ─── Step: Welcome ────────────────────────────────────────────────────────────

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-3xl bg-primary-600 flex items-center justify-center shadow-xl shadow-primary-200 dark:shadow-primary-900/30">
          <CreditCard className="w-10 h-10 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Penny Drop</h1>
      <p className="mt-2 text-base text-gray-500 dark:text-slate-400">
        Know exactly what you're paying for — every month.
      </p>

      <div className="mt-8 space-y-3 text-left">
        {[
          { icon: Search, text: 'Auto-discovers subscriptions from your Gmail' },
          { icon: Sparkles, text: 'Tells you what each service actually does' },
          { icon: RefreshCw, text: 'Alerts you before renewals hit your account' },
          { icon: CheckCircle2, text: 'Helps you decide what to keep or cancel' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-sm text-gray-700 dark:text-slate-300">{text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="mt-8 w-full py-4 px-6 bg-primary-600 text-white rounded-2xl font-semibold text-base hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200 dark:shadow-primary-900/30"
      >
        Get Started <ArrowRight className="w-5 h-5" />
      </button>
      <p className="mt-3 text-xs text-gray-400 dark:text-slate-500">Free to use · Privacy-first · No card required</p>
    </div>
  )
}

// ─── Step: Profile ────────────────────────────────────────────────────────────

function ProfileStep({ form, setForm, onBack, onNext }: StepProps) {
  return (
    <div>
      <BackButton onClick={onBack} />
      <StepHeader step="1 of 4" title="Let's get to know you" subtitle="Just your name to personalise your experience." />
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
            Your name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Priya"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoFocus
            className="w-full px-4 py-3.5 text-base border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <NextButton onClick={onNext} disabled={!form.name.trim()} label="Continue" />
    </div>
  )
}

// ─── Step: Gmail ──────────────────────────────────────────────────────────────

function GmailStep({ form, setForm, onBack, onNext }: StepProps) {
  const [connecting, setConnecting] = useState(false)

  function handleConnect() {
    setConnecting(true)
    setTimeout(() => {
      setForm({ ...form, gmailConnected: true, gmailEmail: 'priya.sharma@gmail.com' })
      setConnecting(false)
    }, 1800)
  }

  return (
    <div>
      <BackButton onClick={onBack} />
      <StepHeader
        step="2 of 4"
        title="Connect your Gmail"
        subtitle={`Hi ${form.name.split(' ')[0]}! We'll scan your inbox to find subscription invoices automatically.`}
      />

      <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Privacy Guarantee</p>
        <p className="text-xs text-emerald-600 dark:text-emerald-400">
          Read-only access only. We extract billing amounts & service names — we never read personal emails or store full email bodies.
        </p>
      </div>

      <div className="mt-6">
        {!form.gmailConnected ? (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 font-medium text-gray-800 dark:text-white hover:border-gray-300 dark:hover:border-slate-500 active:scale-95 transition-all"
          >
            {connecting ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              <GoogleIcon />
            )}
            {connecting ? 'Connecting...' : 'Sign in with Google'}
          </button>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-emerald-400 dark:border-emerald-600">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Gmail Connected!</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{form.gmailEmail}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
      </div>

      <button
        onClick={onNext}
        className="mt-4 w-full text-center text-sm text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 py-2"
      >
        Skip — I'll add subscriptions manually
      </button>

      {form.gmailConnected && <NextButton onClick={onNext} label="Continue" />}
    </div>
  )
}

// ─── Step: Preferences ───────────────────────────────────────────────────────

function PreferencesStep({ form, setForm, onBack, onNext }: StepProps) {
  return (
    <div>
      <BackButton onClick={onBack} />
      <StepHeader step="3 of 4" title="Tracking preferences" subtitle="How far back should we look, and how often should we rescan?" />

      <div className="mt-6 space-y-7">
        {/* Start date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
            <Calendar className="w-4 h-4 inline mr-1.5 -mt-0.5 text-primary-500" />
            Track invoices from
          </label>
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-2">We'll scan emails from this date onwards</p>
          <input
            type="date"
            value={form.trackingStartDate}
            max={today()}
            onChange={(e) => setForm({ ...form, trackingStartDate: e.target.value })}
            className="w-full px-4 py-3.5 text-base border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex gap-2 mt-2">
            {[
              { label: '3 months', n: 3 },
              { label: '6 months', n: 6 },
              { label: '1 year', n: 12 },
            ].map(({ label, n }) => (
              <button
                key={label}
                onClick={() => setForm({ ...form, trackingStartDate: monthsAgo(n) })}
                className={cn(
                  'flex-1 py-2 text-xs rounded-lg font-medium transition-colors',
                  form.trackingStartDate === monthsAgo(n)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
            <RefreshCw className="w-4 h-4 inline mr-1.5 -mt-0.5 text-primary-500" />
            How often should we check your inbox?
          </label>
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">We'll rescan for new invoices on this schedule</p>
          <div className="grid grid-cols-2 gap-2">
            {FREQUENCIES.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setForm({ ...form, checkFrequency: value })}
                className={cn(
                  'flex flex-col items-start p-3.5 rounded-xl border-2 text-left transition-all',
                  form.checkFrequency === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600'
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                )}
              >
                <span className={cn('text-sm font-semibold', form.checkFrequency === value ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-white')}>
                  {label}
                </span>
                <span className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <NextButton onClick={onNext} label="Continue" />
    </div>
  )
}

// ─── Step: Invoice Types ─────────────────────────────────────────────────────

function InvoiceTypesStep({ form, setForm, onBack, onNext }: StepProps) {
  function toggle(id: string) {
    setForm((prev) => ({
      ...prev,
      invoiceCategories: prev.invoiceCategories.includes(id)
        ? prev.invoiceCategories.filter((c) => c !== id)
        : [...prev.invoiceCategories, id],
    }))
  }

  const allSelected = form.invoiceCategories.length === INVOICE_CATEGORIES.length

  return (
    <div>
      <BackButton onClick={onBack} />
      <StepHeader step="4 of 4" title="What should we track?" subtitle="Select the subscription types you want to monitor. You can update this later." />

      <div className="mt-2 flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 dark:text-slate-500">{form.invoiceCategories.length} of {INVOICE_CATEGORIES.length} selected</span>
        <button
          onClick={() => setForm({ ...form, invoiceCategories: allSelected ? [] : INVOICE_CATEGORIES.map((c) => c.id) })}
          className="text-xs text-primary-600 dark:text-primary-400 font-medium"
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      <div className="space-y-2">
        {INVOICE_CATEGORIES.map(({ id, label, icon: Icon, desc }) => {
          const selected = form.invoiceCategories.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={cn(
                'flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all w-full',
                selected
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600'
                  : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              )}
            >
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors', selected ? 'bg-primary-100 dark:bg-primary-900/50' : 'bg-gray-100 dark:bg-slate-700')}>
                <Icon className={cn('w-5 h-5', selected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500')} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold truncate', selected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-white')}>{label}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{desc}</p>
              </div>
              <div className={cn('w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all', selected ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-slate-600')}>
                {selected && <CheckCircle2 className="w-4 h-4 text-white fill-white" />}
              </div>
            </button>
          )
        })}
      </div>

      <NextButton onClick={onNext} disabled={form.invoiceCategories.length === 0} label="Start Scanning My Inbox" className="mt-6" />
    </div>
  )
}

// ─── Step: Scanning ───────────────────────────────────────────────────────────

function ScanningStep({ name, onDone }: { name: string; onDone: () => void }) {
  const [emailCount, setEmailCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [discovered, setDiscovered] = useState<typeof DISCOVERED_SUBS>([])
  const [done, setDone] = useState(false)
  const calledDone = useRef(false)

  useEffect(() => {
    const totalEmails = 847
    const scanMs = 7500
    const tickMs = 50

    const emailTimer = setInterval(() => {
      setEmailCount((c) => Math.min(c + Math.ceil(totalEmails / (scanMs / tickMs)), totalEmails))
      setProgress((p) => Math.min(p + (100 / (scanMs / tickMs)), 100))
    }, tickMs)

    DISCOVERED_SUBS.forEach((sub, i) => {
      setTimeout(() => setDiscovered((prev) => [...prev, sub]), 900 + i * 500)
    })

    const finishTimer = setTimeout(() => {
      clearInterval(emailTimer)
      setEmailCount(totalEmails)
      setProgress(100)
      setDone(true)
      if (!calledDone.current) {
        calledDone.current = true
        setTimeout(onDone, 1000)
      }
    }, scanMs)

    return () => { clearInterval(emailTimer); clearTimeout(finishTimer) }
  }, [])

  return (
    <div>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center transition-colors', done ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-primary-100 dark:bg-primary-900/30')}>
            {done
              ? <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              : <Search className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-pulse" />
            }
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {done ? 'Scan complete!' : 'Scanning your inbox...'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          {done
            ? `Found ${discovered.length} subscriptions, ${name.split(' ')[0]}!`
            : `Reading through ${emailCount.toLocaleString()} of 847 emails`}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-gray-400">
          <span>{emailCount.toLocaleString()} emails scanned</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Discovered list */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Subscriptions found ({discovered.length})
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {discovered.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800"
              style={{ animation: 'slideIn 0.3s ease-out' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: sub.color }}>
                {sub.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{sub.name}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{sub.category}</p>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white shrink-0">
                {sub.amount === 0 ? 'Free' : `₹${sub.amount}/mo`}
              </p>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step: Review ─────────────────────────────────────────────────────────────

function ReviewStep({ form, setForm, onNext }: StepProps) {
  function toggle(id: string) {
    setForm((prev) => ({
      ...prev,
      confirmedIds: prev.confirmedIds.includes(id)
        ? prev.confirmedIds.filter((i) => i !== id)
        : [...prev.confirmedIds, id],
    }))
  }

  const totalMonthly = DISCOVERED_SUBS
    .filter((s) => form.confirmedIds.includes(s.id))
    .reduce((sum, s) => sum + s.amount, 0)

  const allSelected = form.confirmedIds.length === DISCOVERED_SUBS.length

  return (
    <div>
      <div className="text-center mb-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-7 h-7 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">We found {DISCOVERED_SUBS.length} subscriptions!</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Confirm which ones to track. You can always add or remove later.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-3 text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white">₹{totalMonthly.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">estimated/month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-3 text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{form.confirmedIds.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">to track</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">Subscriptions found</p>
        <button
          onClick={() => setForm((prev) => ({ ...prev, confirmedIds: allSelected ? [] : DISCOVERED_SUBS.map((s) => s.id) }))}
          className="text-xs text-primary-600 dark:text-primary-400 font-medium"
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {DISCOVERED_SUBS.map((sub) => {
          const selected = form.confirmedIds.includes(sub.id)
          return (
            <button
              key={sub.id}
              onClick={() => toggle(sub.id)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                selected
                  ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/10 dark:border-primary-700'
                  : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-50'
              )}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: sub.color }}>
                {sub.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{sub.name}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{sub.category}</p>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white shrink-0">
                {sub.amount === 0 ? 'Free' : `₹${sub.amount}/mo`}
              </p>
              <div className={cn('w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all', selected ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-slate-600')}>
                {selected && <CheckCircle2 className="w-4 h-4 text-white fill-white" />}
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={onNext}
        disabled={form.confirmedIds.length === 0}
        className="mt-5 w-full py-4 px-6 bg-primary-600 text-white rounded-2xl font-semibold text-base hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-primary-200 dark:shadow-primary-900/30"
      >
        Confirm & Start Tracking <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}

// ─── Step: Processing ─────────────────────────────────────────────────────────

function ProcessingStep({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [phaseIdx, setPhaseIdx] = useState(0)

  useEffect(() => {
    const duration = 3500
    const tickMs = 40
    const increment = 100 / (duration / tickMs)

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + increment, 100)
        if (next >= 100) clearInterval(interval)
        return next
      })
    }, tickMs)

    PROCESSING_PHASES.forEach((_, i) => {
      setTimeout(() => setPhaseIdx(i), (duration / PROCESSING_PHASES.length) * i)
    })

    const doneTimer = setTimeout(onDone, duration + 800)
    return () => { clearInterval(interval); clearTimeout(doneTimer) }
  }, [])

  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Setting everything up...</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 min-h-5">{PROCESSING_PHASES[phaseIdx]}</p>

      <div className="mt-8">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{Math.round(progress)}% complete</p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {[
          { value: '847', label: 'Emails read' },
          { value: '14', label: 'Subscriptions' },
          { value: '₹9.4K', label: 'Monthly spend' },
        ].map(({ value, label }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-3">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Shared components ────────────────────────────────────────────────────────

interface StepProps {
  form: FormData
  setForm: (f: FormData | ((prev: FormData) => FormData)) => void
  onBack: () => void
  onNext: () => void
}

function StepHeader({ step, title, subtitle }: { step: string; title: string; subtitle: string }) {
  return (
    <div className="mt-4 mb-1">
      <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{step}</p>
      <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">{subtitle}</p>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 transition-colors -ml-1">
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  )
}

function NextButton({ onClick, disabled, label, className }: { onClick: () => void; disabled?: boolean; label: string; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'mt-8 w-full py-4 px-6 bg-primary-600 text-white rounded-2xl font-semibold text-base hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-primary-200 dark:shadow-primary-900/30',
        className
      )}
    >
      {label} <ArrowRight className="w-5 h-5" />
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function monthsAgo(n: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d.toISOString().split('T')[0]
}
