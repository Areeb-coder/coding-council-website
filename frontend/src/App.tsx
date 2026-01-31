import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar, Hero, About, Events, Team, Projects, Testimonials, Contact, Footer, ProtectedRoute } from './components';
import { initializeTheme } from './stores/themeStore';
import { useAuthStore } from './stores/authStore';
import './index.css';

// Lazy load admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const EventsManager = lazy(() => import('./pages/admin/EventsManager'));
const TeamManager = lazy(() => import('./pages/admin/TeamManager'));
const RegistrationsViewer = lazy(() => import('./pages/admin/RegistrationsViewer'));
const MessagesViewer = lazy(() => import('./pages/admin/MessagesViewer'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const BlogManager = lazy(() => import('./pages/admin/BlogManager'));
const ReviewsManager = lazy(() => import('./pages/admin/ReviewsManager'));

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Home page - main website
function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Events />
        <Team />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    initializeTheme();
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-300">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-accent)',
                secondary: 'white',
              },
            },
          }}
        />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main website */}
            <Route path="/" element={<HomePage />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin/*" element={
              <ProtectedRoute>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="events" element={<EventsManager />} />
                  <Route path="team" element={<TeamManager />} />
                  <Route path="registrations" element={<RegistrationsViewer />} />
                  <Route path="messages" element={<MessagesViewer />} />
                  <Route path="blog" element={<BlogManager />} />
                  <Route path="reviews" element={<ReviewsManager />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            } />

            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
