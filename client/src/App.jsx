import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import { PageWrapper } from './components/Animated';
import Home from './pages/Home';
import About from './pages/About';
import Organization from './pages/Organization';
import Team from './pages/Team';
import Events from './pages/Events';
import EventProtocol from './pages/EventProtocol';
import Achievements from './pages/Achievements';
import AchievementDetail from './pages/AchievementDetail';
import Workbench from './pages/Workbench';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
          <Route path="gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
          <Route path="contact" element={<PageWrapper><Contact /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
