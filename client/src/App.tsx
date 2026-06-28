import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToastContainer } from './components/ToastContainer';
import { useAuth } from './store/auth';
import { useSettings, applyTheme } from './store/settings';

import Landing from './features/landing/Landing';
import Dashboard from './features/landing/Dashboard';
import TimerPage from './features/timer/TimerPage';
import CalculatorPage from './features/calculator/CalculatorPage';
import AlgTrainerPage from './features/alg-trainer/AlgTrainerPage';
import LoginPage from './features/auth/LoginPage';
import SettingsPage from './features/settings/SettingsPage';
import AdminPage from './features/admin/AdminPage';

function ProtectedRoute({ children, admin }: { children: JSX.Element; admin?: boolean }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-8 text-muted">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (admin && user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-muted">Loading…</div>;
  return user ? <Dashboard /> : <Landing />;
}

export default function App() {
  const init = useAuth((s) => s.init);
  const theme = useSettings((s) => s.theme);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/alg-trainer" element={<AlgTrainerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute admin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </Layout>
  );
}
