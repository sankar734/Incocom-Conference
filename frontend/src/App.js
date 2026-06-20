import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import PaymentPage from './pages/PaymentPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ThemeDetailPage from './pages/themes/ThemeDetailPage';

function Layout({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>{!isAdmin && <Navbar />}<main>{children}</main>{!isAdmin && <Footer />}</>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Toaster position="top-right" toastOptions={{
          duration: 5000,
          style: { background: '#0a1628', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' },
          success: { iconTheme: { primary: '#0d7e8a', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }} />
        <Suspense fallback={<LoadingSpinner />}>
          <Layout>
            <Routes>
              <Route path="/"                        element={<HomePage />} />
              <Route path="/register"                element={<RegisterPage />} />
              <Route path="/payment/:registrationId" element={<PaymentPage />} />
              <Route path="/themes/:slug"            element={<ThemeDetailPage />} />
              <Route path="/admin/login"             element={<AdminLoginPage />} />
              <Route path="/admin/dashboard"         element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-hero-gradient">
                  <div className="text-center text-white px-4">
                    <div className="text-8xl font-display font-black text-gold-400 mb-4">404</div>
                    <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
                    <a href="/" className="btn-primary inline-flex mt-2">← Go Home</a>
                  </div>
                </div>
              } />
            </Routes>
          </Layout>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}
