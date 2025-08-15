import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Home from './pages/home';
import Habits from './pages/habits';
import { useDarkMode } from './components/ui/useDarkMode';

export default function App(){
  const [dark, setDark] = useDarkMode();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-white">

      {/* --- topbar simple --- */}
      <div className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container py-3 flex items-center justify-between">
          
          {/* Logo cliquable qui renvoie à l'accueil */}
          <Link 
            to="/" 
            className="font-semibold flex items-center gap-2"
          >
            <span className="h-5 w-5">🧠</span>
            2ᵉ <span>CERVEAU</span>
          </Link>

          {/* Bouton mode clair/sombre */}
          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm"
          >
            {dark ? 'Clair' : 'Sombre'}
          </button>
        </div>
      </div>

      {/* --- ROUTES --- */}
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/habits" element={<Habits />} />
        {/* Catch-all vers Home */}
        <Route path="*" element={<Home />} />
      </Routes>

    </div>
  );
}
