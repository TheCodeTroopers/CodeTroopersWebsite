import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import { PageWrapper } from './components/Animated';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Organization = lazy(() => import('./pages/Organization'));
const Team = lazy(() => import('./pages/Team'));
const Events = lazy(() => import('./pages/Events'));
const EventProtocol = lazy(() => import('./pages/EventProtocol'));
const Achievements = lazy(() => import('./pages/Achievements'));
const AchievementDetail = lazy(() => import('./pages/AchievementDetail'));
const Workbench = lazy(() => import('./pages/Workbench'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const JoinUs = lazy(() => import('./pages/JoinUs'));
const Login = lazy(() => import('./pages/Login'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function AnimatedRoutes() {
  const location = useLocation();

  // Group sub-routes under top-level path so modal overlays don't trigger full-page exit/re-entry
  const getRouteKey = (pathname) => {
    if (pathname.startsWith('/achievements')) return '/achievements';
    if (pathname.startsWith('/blogs')) return '/blogs';
    if (pathname.startsWith('/admin')) return '/admin';
    return pathname;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={getRouteKey(location.pathname)}>
        {/* Public Website Layout */}
        <Route element={<Layout />}>
          <Route index element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="organization" element={<PageWrapper><Organization /></PageWrapper>} />
          <Route path="team" element={<PageWrapper><Team /></PageWrapper>} />
          <Route path="events/workshops" element={<PageWrapper><Events /></PageWrapper>} />
          <Route path="events/hackathons" element={<PageWrapper><Events /></PageWrapper>} />
          <Route path="events/competitions" element={<PageWrapper><Events /></PageWrapper>} />
          <Route path="events/technical-talks" element={<PageWrapper><Events /></PageWrapper>} />
          <Route path="events/guest-lectures" element={<PageWrapper><Events /></PageWrapper>} />
          <Route path="event-protocol" element={<PageWrapper><EventProtocol /></PageWrapper>} />
          <Route path="achievements" element={<PageWrapper><Achievements /></PageWrapper>} />
          <Route path="achievements/:id" element={<PageWrapper><Achievements /></PageWrapper>} />
          <Route path="workbench" element={<PageWrapper><Workbench /></PageWrapper>} />
          <Route path="blogs" element={<PageWrapper><Blogs /></PageWrapper>} />
          <Route path="blogs/:id" element={<PageWrapper><BlogDetail /></PageWrapper>} />
          <Route path="gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
          <Route path="contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="join-us" element={<PageWrapper><JoinUs /></PageWrapper>} />
          <Route path="login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
          <Route path="terms-of-service" element={<PageWrapper><TermsOfService /></PageWrapper>} />
        </Route>

        {/* Dedicated Protected Admin Dashboard */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-busy="true" />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/*"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-busy="true" />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
