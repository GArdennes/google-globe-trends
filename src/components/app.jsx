// In index.js or App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobePage from '../pages/GlobePage';
import AboutPage from '../pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GlobePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
