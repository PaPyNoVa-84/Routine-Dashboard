import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, SunMedium, Moon, CheckSquare, Target, CalendarDays, Dumbbell, Apple, Settings, ChevronRight } from 'lucide-react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Habits from './pages/Habits'   // <- notre page Habitudes

// --- Dark mode small helper ---
function useDarkMode(){
  const [dark, setDark] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('darkMode')) || false } catch { return false }
  })
  useEffect(()=>{
    localStorage.setItem('darkMode', JSON.stringify(dark))
    const el = document.documentElement
    if(dark) el.classList.add('dark'); else el.classList.remove('dark')
  }, [dark])
  return [dark, setDark]
}

// --- Tuiles de l'accueil (lectures/études retirées) ---
const tiles = [
  { id: 'habits',   href: '/habits',   icon: <CheckSquare className='icon-tile' />, title: 'Mes habitudes', subtitle: '& ma to-do list' },
  { id: 'goals',    href: '/goals',    icon: <Target className='icon-tile' />,      title: 'Mes objectifs', subtitle: '& mes notes' },
  { id: 'calendar', href: '/calendar', icon: <CalendarDays className='icon-tile' />,title: 'Calendrier',    subtitle: 'plan de la semaine' },
  { id: 'todo',     href: '/todo',     icon: <CheckSquare className='icon-tile' />, title: 'Ma to-do',      subtitle: 'aujourd’hui & semaine' },
  { id: 'training', href: '/training', icon: <Dumbbell className='icon-tile' />,    title: 'Entraînement',  subtitle: 'sport & progrès' },
  { id: 'health',   href: '/health',   icon: <Apple className='icon-tile' />,       title: 'Santé',         subtitle: 'sommeil & routine' },
  { id: 'settings', href: '/settings', icon: <Settings className='icon-tile' />,    title: 'Réglages',      subtitle: 'thème & presets' },
]

// --- Composant tuile cliquable ---
function Tile({icon, title, subtitle, href}) {
  return (
    <motion.div whileHover={{ y: -2 }} className="card w-full p-5 md:p-6 text-left">
      <Link to={href} className="block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid place-items-center h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800">{icon}</div>
            <div>
              <div className="font-semibold">{title}</div>
              <div className="text-xs text-zinc-500">{subtitle}</div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-zinc-400" />
        </div>
      </Link>
    </motion.div>
  )
}

// --- Page d'accueil (grille de tuiles) ---
function Home(){
  const today = new Date()
  const dateFmt = today.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })
  return (
    <div className="container py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6" />
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Aujourd’hui — {dateFmt}</div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">Ton tableau de bord</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map(t => <Tile key={t.id} {...t} />)}
      </div>
    </div>
  )
}

// --- App avec ROUTES ---
export default function App(){
  const [dark, setDark] = useDarkMode()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-white">
      {/* topbar simple */}
      <div className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container py-3 flex items-center justify-between">
          <div className="font-semibold flex items-center gap-2"><Brain className="h-5 w-5"/><span>2ᵉ CERVEAU</span></div>
          <button onClick={()=>setDark(!dark)} className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm">
            {dark ? 'Clair' : 'Sombre'}
          </button>
        </div>
      </div>

      {/* ROUTES */}
      <Routes location={location}>
        <Route path="/" element={<Home/>} />
        <Route path="/habits" element={<Habits/>} />
        {/* tu pourras ajouter ici : goals, calendar, todo, training, health, settings */}
        <Route path="*" element={<Home/>} />
      </Routes>
    </div>
  )
}
