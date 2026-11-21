import { Suspense } from 'react';
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
        <Suspense fallback={<div style={{ minHeight: '70vh' }} aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
