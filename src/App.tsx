import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import PageLayout from './components/layout/PageLayout'
import Dashboard from './pages/Dashboard'
import SubscriptionDetail from './pages/SubscriptionDetail'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'

function ProtectedLayout() {
  const onboarded = localStorage.getItem('penny-drop-onboarded')
  if (!onboarded) return <Navigate to="/onboarding" replace />
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SubscriptionProvider>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/subscription/:id" element={<SubscriptionDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SubscriptionProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
