import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAppStore } from './lib/store';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const Exam = React.lazy(() => import('./pages/Exam'));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useAppStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

    // Redirect admin users to admin panel when trying to access student dashboard
  if (user.role === 'admin' && window.location.pathname === '/dashboard') {
    return <Navigate to="/admin" />;
  }

    // Redirect student users to dashboard when trying to access admin panel
  if (user.role === 'user' && window.location.pathname === '/admin') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

function App() {
  const user = useAppStore((state) => state.user);

  return (
    <BrowserRouter>
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500" />
        </div>
      }>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />
            ) : (
              <Home />
            )
          } />
          <Route path="/login" element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />
            ) : (
              <Login />
            )
          } />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route element={<Layout />}>
            {/* Student routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            <Route path="/exam" element={
              <PrivateRoute>
                <Exam />
              </PrivateRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
