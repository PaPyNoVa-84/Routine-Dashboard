import React, { useEffect, useMemo, useState, useCallback } from 'react'

/* =========================
   Helpers localStorage + date
   ========================= */
const todayKey = () => new Date().toISOString().slice(0,10)
const load = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f } catch { return f } }
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))

/* =========================
   Habitudes par défaut (ta liste)
   ========================= */
const defaultHabits = [
  { id:'h_water',   name:"Boire 1,5L d'eau" },
  { id:'h_sport',   name:'Sport 30–60 min' },
  { id:'h_work2h',  name:'2h travail' },
  { id:'h_family',  name:'Famille' },
  { id:'h_house',   name:'Tâches ménagères' },
  { id:'h_stretch', name:'Étirements' },
]

/* =========================
   Routine hebdo (simple liste avec heures)
   ========================= */
const defaultTemplate = {
  Mon: [
    { id:'mo1', time:'08:00', text:'Hydratation + lumière du jour' },
    { id:'mo2', time:'09:00', text:'Deep Work — 2h' },
    { id:'mo3', time:'18:00', text:'Sport / Étirements' },
  ],
  Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [],
}
const wd = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const wdLabel = { Mon:'Lundi', Tue:'Mardi', Wed:'Mercredi', Thu:'Jeudi', Fri:'Vendredi', Sat:'Samedi', Sun:'Dimanche' }

/* Petite section visuelle réutilisable */
function Section({ title, right, children }) {
  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">{title}</div>
        <div>{right}</div>
      </div>
      {children}
    </div>
  )
}

/* Progress ring pour % du jour (option C2) */
function ProgressRing({ value=0, size=84, stroke=10 }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const o = c * (1 - Math.min(Math.max(value,0),1))
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#e5e7eb" className="dark:stroke-zinc-800" strokeWidth={stroke} fill="none"/>
      <circle cx={size/2} cy={size/2} r={r} stroke="var(--accent)" strokeWidth={stroke} fill="none"
              style={{transform:'rotate(-90deg)', transformOrigin:'50% 50%'}}
              strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round"/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-sm font-semibold">
        {Math.round(value*100)}%
      </text>
    </svg>
  )
}

/* ====== utilitaire: ms jusqu'à minuit ====== */
function msUntilMidnight() {
  const now = new Date()
  const next = new Date(now)
  next.setHours(24, 0, 0, 0) // minuit prochain
  return next.getTime() - now.getTime()
}

/* =========================
   Composant principal
   ========================= */
export default function Habits(){
  const [tab, setTab] = useState('daily') // daily | week

  /* --- Habitudes (liste simple) --- */
  const HABITS_KEY = 'habits:list:v2' // versionne la clé pour forcer les defaults si tu les changes
  const [habits, setHabits] = useState(()=> load(HABITS_KEY, defaultHabits))
  const [done, setDone] = useState(()=> load('habits:done:'+todayKey(), {}))
  const [newHabit, setNewHabit] = useState('')

  useEffect(()=> save(HABITS_KEY, habits), [habits])
  useEffect(()=> save('habits:done:'+todayKey(), done), [done])

  const toggleHabit = id => setDone(d => ({ ...d, [id]: !d[id] }))
  const addHabit = ()=>{
    const n = newHabit.trim(); if(!n) return
    setHabits(h => [...h, { id: crypto.randomUUID(), name:n }]); setNewHabit('')
  }
  const removeHabit = id => setHabits(h => h.filter(x => x.id!==id))
  const progress = useMemo(()=> habits.length ? Object.values(done).filter(Boolean).length / habits.length : 0, [done, habits])

  /* --- Routine hebdo --- */
  const [tmpl, setTmpl] = useState(()=> load('routine:template', defaultTemplate))
  useEffect(()=> save('routine:template', tmpl), [tmpl])

  const todayWd = wd[new Date().getDay()]
  const [currentDay, setCurrentDay] = useState(todayWd)

  const addStep = day => setTmpl(t => ({ ...t, [day]: [...(t[day]||[]), { id:crypto.randomUUID(), time:'09:00', text:'Nouvelle étape' }] }))
  const rmStep = (day,id) => setTmpl(t => ({ ...t, [day]: (t[day]||[]).filter(x => x.id!==id) }))
  const updStep = (day,id,patch) => setTmpl(t => ({ ...t, [day]: (t[day]||[]).map(x => x.id===id ? { ...x, ...patch } : x) }))

  /* Checklist "aujourd'hui" depuis la routine */
  const [todayCheck, setTodayCheck] = useState(()=> load('routine:done:'+todayKey(), {}))
  useEffect(()=> save('routine:done:'+todayKey(), todayCheck), [todayCheck])
  const todayList = (tmpl[todayWd]||[]).sort((a,b)=> a.time.localeCompare(b.time))

  /* ====== REMISE À ZÉRO ====== */

  // Fonction centralisée : vide toutes les coches d'habitudes et de routine du jour
  const hardReset = useCallback(() => {
    // supprime les clés locales des coches
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('habits:done:') || k.startsWith('routine:done:')) {
        localStorage.removeItem(k)
      }
    })
    // remet les états React à vide
    setDone({})
    setTodayCheck({})
    // mémorise la date afin d'éviter une boucle
    localStorage.setItem('habits:lastDate', todayKey())
  }, [])

  // Au chargement, si la date a changé -> reset immédiat.
  // Et on programme un reset automatique à minuit si l'app reste ouverte.
  useEffect(() => {
    const today = todayKey()
    const last = localStorage.getItem('habits:lastDate')
    if (last !== today) {
      hardReset()
    }
    const t = setTimeout(() => {
      hardReset() // minuit atteint
    }, msUntilMidnight())
    return () => clearTimeout(t)
  }, [hardReset])

  /* =========================
     Rendu
     ========================= */
  return (
    <div className="container py-6 space-y-4">
      <div className="text-xs text-zinc-500 uppercase tracking-wider">Mes habitudes & routine</div>
      <h1 className="text-2xl font-bold">Habitudes</h1>

      {/* Onglets sticky */}
      <div className="sticky-tabs mt-2">
        <div className="sticky-tabs-inner inline-flex gap-1">
          <button onClick={()=>setTab('daily')}  className={`px-3 py-1.5 rounded-xl ${tab==='daily' ? 'text-white' : 'border border-transparent'}`} style={tab==='daily'?{background:'var(--accent)'}:{}} >
            Habitudes quotidiennes
          </button>
          <button onClick={()=>setTab('week')} className={`px-3 py-1.5 rounded-xl ${tab==='week' ? 'text-white' : 'border border-transparent'}`} style={tab==='week'?{background:'var(--accent)'}:{}} >
            Routine hebdo
          </button>
        </div>
      </div>

      {tab==='daily' && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Checklist + progress + bouton Réinitialiser */}
          <Section
            title="Checklist du jour"
            right={
              <div className="flex items-center gap-3">
                <span className="badge">{Object.values(done).filter(Boolean).length}/{habits.length}</span>
                <ProgressRing value={progress}/>
                <button
                  onClick={hardReset}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm"
                  title="Remettre à zéro les coches du jour"
                >
                  Réinitialiser
                </button>
              </div>
            }
          >
            <div className="space-y-2">
              {habits.map(h => (
                <label key={h.id} className="flex items-center justify-between rounded-xl border p-3 dark:border-zinc-800 hover:shadow">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="h-5 w-5" checked={!!done[h.id]} onChange={()=>toggleHabit(h.id)} />
                    <span>{h.name}</span>
                  </div>
                  <button onClick={()=>removeHabit(h.id)} className="text-zinc-400 hover:text-red-500">Supprimer</button>
                </label>
              ))}
              {habits.length===0 && <div className="text-sm text-zinc-500">Aucune habitude pour l’instant.</div>}
            </div>
          </Section>

          {/* Ajout rapide */}
          <Section title="Ajouter / éditer">
            <div className="flex gap-2">
              <input value={newHabit} onChange={e=>setNewHabit(e.target.value)} placeholder="Nouvelle habitude"
                     className="border rounded-xl px-3 py-2 w-full dark:border-zinc-800"/>
              <button onClick={addHabit} className="px-3 py-2 rounded-xl text-white" style={{background:'var(--accent)'}}>Ajouter</button>
            </div>
          </Section>

          {/* Checklist générée depuis la routine du jour */}
          <Section title={`Aujourd’hui — ${wdLabel[wd[new Date().getDay()] ]}`} right={<span className="badge">{todayList.length} étapes</span>}>
            <div className="space-y-2">
              {todayList.map(it => (
                <label key={it.id} className="flex items-center gap-3 rounded-xl border p-3 dark:border-zinc-800">
                  <input type="checkbox" className="h-5 w-5" checked={!!todayCheck[it.id]}
                         onChange={()=>setTodayCheck(s=>({...s, [it.id]: !s[it.id]}))}/>
                  <span className="font-medium tabular-nums">{it.time}</span>
                  <span>{it.text}</span>
                </label>
              ))}
              {todayList.length===0 && <div className="text-sm text-zinc-500">Aucune étape prévue.</div>}
            </div>
          </Section>
        </div>
      )}

      {tab==='week' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <button key={d} onClick={()=>setCurrentDay(d)}
                className={`px-3 py-1.5 rounded-xl border ${currentDay===d?'text-white':''}`}
                style={currentDay===d?{background:'var(--accent)'}:{}} >
                {wdLabel[d]}
              </button>
            ))}
          </div>

          <Section title={`Routine — ${wdLabel[currentDay]}`} right={
            <button onClick={()=>addStep(currentDay)} className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">+ Étape</button>
          }>
            <div className="space-y-2">
              {(tmpl[currentDay]||[]).sort((a,b)=>a.time.localeCompare(b.time)).map(it => (
                <div key={it.id} className="flex items-center gap-2 border rounded-xl p-2 dark:border-zinc-800">
                  <input type="time" value={it.time} onChange={e=>updStep(currentDay, it.id, { time:e.target.value })} className="border rounded-xl px-2 py-1 dark:border-zinc-800"/>
                  <input value={it.text} onChange={e=>updStep(currentDay, it.id, { text:e.target.value })} className="border rounded-xl px-3 py-1 w-full dark:border-zinc-800"/>
                  <button onClick={()=>rmStep(currentDay, it.id)} className="px-2 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800">Suppr</button>
                </div>
              ))}
              {(!tmpl[currentDay] || tmpl[currentDay].length===0) && <div className="text-sm text-zinc-500">Aucune étape — ajoute ta première avec “+ Étape”.</div>}
            </div>
          </Section>
        </div>
      )}
    </div>
  )
}
