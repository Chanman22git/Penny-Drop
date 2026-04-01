import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import PageLayout from './components/layout/PageLayout'
import Dashboard from './pages/Dashboard'
import SubscriptionDetail from './pages/SubscriptionDetail'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SubscriptionProvider>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route
              path="*"
              element={
                <PageLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/subscription/:id" element={<SubscriptionDetail />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </PageLayout>
              }
            />
          </Routes>
        </SubscriptionProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
