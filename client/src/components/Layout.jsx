import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
