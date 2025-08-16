import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import useDarkMode from "./components/ui/useDarkMode";

// Import de toutes les pages
import Home from "./pages/Home";
import Habits from "./pages/Habits";
import Calendar from "./pages/Calendar";
import Goals from "./pages/Goals";
import Health from "./pages/Health";
import Settings from "./pages/Settings";
import Todo from "./pages/Todo";
import Training from "./pages/Training";

export default function App() {
  const [dark, setDark] = useDarkMode();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-white">
      {/* Barre du haut */}
      <div className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container py-3 flex items-center justify-between">
          {/* Logo cliquable vers la page d'accueil */}
          <div
            className="font-semibold flex items-center gap-2 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <span>2<sup>e</sup> CERVEAU</span>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm"
          >
            {dark ? "Clair" : "Sombre"}
          </button>
        </div>
      </div>

      {/* ROUTES */}
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/health" element={<Health />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/training" element={<Training />} />
        {/* Route par défaut */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
