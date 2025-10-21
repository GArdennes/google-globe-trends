// In index.js or App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Dynamic imports for code splitting
const GlobePage = lazy(() => import('../pages/GlobePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<GlobePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
