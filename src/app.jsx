import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Flame, Heart, ListChecks, Play, Pause, RotateCcw, Download, Upload, Trash2, Plus, Target, CalendarDays } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Switch } from './components/ui/switch'
import { Checkbox } from './components/ui/checkbox'
import { Label } from './components/ui/label'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip } from 'recharts'

const todayKey = () => new Date().toISOString().slice(0,10)
const load = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f } catch { return f } }
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v))

const defaultBlocks = [
  { id: 'm1', start: '08:00', end: '08:30', title: 'Hydratation + 10 min marche', area: 'Morning' },
  { id: 'm2', start: '08:30', end: '09:00', title: 'Routine soin / douche', area: 'Morning' },
  { id: 'w1', start: '09:00', end: '11:00', title: 'Deep Work — Produit/Pubs', area: 'Work' },
  { id: 'w2', start: '11:00', end: '12:00', title: 'Créa visuels / UGC', area: 'Work' },
  { id: 'h1', start: '12:30', end: '13:00', title: 'Déjeuner léger', area: 'Health' },
  { id: 'w3', start: '14:00', end: '16:00', title: 'Testing / Analyse KPI', area: 'Work' },
  { id: 'a1', start: '16:00', end: '16:30', title: 'Admin — mails, URSSAF, banque', area: 'Admin' },
  { id: 'e1', start: '18:00', end: '19:00', title: 'Sport / Marche rapide', area: 'Health' },
  { id: 'n1', start: '22:30', end: '23:00', title: 'Déconnexion / Lecture 15 min', area: 'Evening' },
]

const defaultHabits = [
  { id: 'h_water', name: '1,5L d\'eau', target: 1 },
  { id: 'h_walk', name: 'Marche 20 min', target: 1 },
  { id: 'h_sport', name: 'Séance sport', target: 1 },
  { id: 'h_ads', name: 'Analyser les ads 30 min', target: 1 },
  { id: 'h_learning', name: 'Formation 30 min', target: 1 },
  { id: 'h_sleep', name: 'Coucher < 23h', target: 1 },
]

const prettyArea = {
  Morning: { color: 'bg-amber-100', ring: 'ring-amber-300' },
  Work: { color: 'bg-blue-100', ring: 'ring-blue-300' },
  Health: { color: 'bg-emerald-100', ring: 'ring-emerald-300' },
  Admin: { color: 'bg-purple-100', ring: 'ring-purple-300' },
  Evening: { color: 'bg-zinc-100', ring: 'ring-zinc-300' }
}

const emptyDay = { tasks: [], habitsDone: {}, notes: '' }

function Pomodoro({ onSessionComplete }){
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const total = minutes*60 + seconds
  const initialRef = useRef(total)
  useEffect(()=>{ initialRef.current = total },[])
  useEffect(()=>{
    if(!running) return
    const id = setInterval(()=>{
      setSeconds(s=>{
        if(minutes===0 && s===0){ clearInterval(id); setRunning(false); onSessionComplete?.(); return 0 }
        if(s===0){ setMinutes(m=>Math.max(0,m-1)); return 59 }
        return s-1
      })
    },1000)
    return ()=>clearInterval(id)
  },[running, minutes])
  const pct = initialRef.current ? 1 - total / initialRef.current : 0
  const circumference = 2*Math.PI*48
  const dash = circumference * pct
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5"/>Pomodoro</CardTitle>
        <CardDescription>Focus court pour créer l'élan</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" strokeWidth="8" className="text-zinc-200" fill="none" stroke="currentColor"/>
            <circle cx="60" cy="60" r="48" strokeWidth="8" className="text-zinc-800" fill="none" strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" stroke="currentColor"/>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-3xl font-semibold tabular-nums">{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={()=>setRunning(r=>!r)} className="rounded-2xl shadow">{running ? <><Pause className="mr-2 h-4 w-4"/>Pause</> : <><Play className="mr-2 h-4 w-4"/>Start</>}</Button>
          <Button variant="secondary" onClick={()=>{ setRunning(false); setMinutes(25); setSeconds(0); initialRef.current = 25*60 }} className="rounded-2xl"><RotateCcw className="mr-2 h-4 w-4"/>Reset</Button>
        </div>
        <div className="flex items-center gap-2">
          <Label>Durée</Label>
          <select value={minutes} onChange={e=>{ const n=parseInt(e.target.value); setMinutes(n); setSeconds(0); initialRef.current = n*60 }} className="border rounded-xl px-2 py-1">
            {[15,20,25,30,45,50].map(n=> <option key={n} value={n}>{n} min</option>)}
          </select>
        </div>
      </CardContent>
    </Card>
  )
}

function StreakChart({ data }){
  const formatted = useMemo(()=> data.map(d=>({ day: d.date.slice(5), score: d.score })), [data])
  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <RTooltip />
          <Line type="monotone" dataKey="score" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function Block({ b, now }){
  const area = prettyArea[b.area] || prettyArea.Work
  const isNow = now >= b.start && now <= b.end
  return (
    <div className={`rounded-2xl p-3 ${area.color} ring-1 ${area.ring} ${isNow ? 'ring-2' : ''}`}>
      <div className="text-xs text-zinc-600">{b.start} → {b.end} · {b.area}</div>
      <div className="font-medium">{b.title}</div>
    </div>
  )
}

function TimeBlocks({ blocks, setBlocks }){
  const [form, setForm] = useState({ title:'', start:'09:00', end:'10:00', area:'Work' })
  const now = new Date()
  const nowStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  const add = ()=>{
    if(!form.title) return
    const n = { id: crypto.randomUUID(), ...form }
    setBlocks(arr=>[...arr, n].sort((a,b)=>a.start.localeCompare(b.start)))
    setForm({ ...form, title:'' })
  }
  const remove = (id)=> setBlocks(arr=>arr.filter(x=>x.id!==id))
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5"/>Time Blocking du jour</CardTitle>
        <CardDescription>Planifie ta journée en blocs clairs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-2 items-end">
          <div>
            <Label>Titre</Label>
            <Input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Ex: Deep Work — Ads" />
          </div>
          <div>
            <Label>Début</Label>
            <Input type="time" value={form.start} onChange={e=>setForm({...form, start:e.target.value})} />
          </div>
          <div>
            <Label>Fin</Label>
            <Input type="time" value={form.end} onChange={e=>setForm({...form, end:e.target.value})} />
          </div>
          <div>
            <Label>Zone</Label>
            <select value={form.area} onChange={e=>setForm({...form, area:e.target.value})} className="border rounded-xl px-3 py-2 text-sm w-full">
              {Object.keys(prettyArea).map(k=> <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <Button onClick={add} className="w-full rounded-2xl"><Plus className="mr-2 h-4 w-4"/>Ajouter</Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {blocks.map(b=> (
            <div key={b.id} className="relative group">
              <Block b={b} now={nowStr} />
              <button onClick={()=>remove(b.id)} className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition">
                <Trash2 className="h-5 w-5 text-zinc-500"/>
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DailyTasks({ day, setDay }){
  const [title, setTitle] = useState('')
  const add = ()=> { if(!title.trim()) return; setDay(d=>({...d, tasks:[...d.tasks, { id: crypto.randomUUID(), title, done:false }]})); setTitle('') }
  const toggle = (id)=> setDay(d=>({...d, tasks:d.tasks.map(t=> t.id===id ? {...t, done:!t.done} : t)}))
  const remove = (id)=> setDay(d=>({...d, tasks:d.tasks.filter(t=>t.id!==id)}))
  const doneCount = day.tasks.filter(t=>t.done).length
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5"/>Tâches du jour</CardTitle>
        <CardDescription>{doneCount}/{day.tasks.length} terminées</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ajouter une tâche rapide" onKeyDown={e=> e.key==='Enter' && add()} />
          <Button onClick={add} className="rounded-2xl"><Plus className="mr-2 h-4 w-4"/>Ajouter</Button>
        </div>
        <div className="space-y-2">
          {day.tasks.map(t=> (
            <div key={t.id} className="flex items-center justify-between rounded-xl border p-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={t.done} onCheckedChange={()=>toggle(t.id)} />
                <span className={`text-sm ${t.done ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>{t.title}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={()=>remove(t.id)}><Trash2 className="h-4 w-4"/></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function Habits({ day, setDay, allHabits, setAllHabits, streakData, setStreakData }){
  const toggle = (id)=> setDay(d=> ({...d, habitsDone: { ...d.habitsDone, [id]: !d.habitsDone[id] }}))
  const [newHabit, setNewHabit] = useState('')
  const addHabit = ()=> { if(!newHabit.trim()) return; setAllHabits(hs=>[...hs, { id: crypto.randomUUID(), name:newHabit, target:1 }]); setNewHabit('') }
  useEffect(()=>{
    const score = Object.values(day.habitsDone).filter(Boolean).length
    const last = streakData[streakData.length-1]
    if(!last || last.date !== todayKey()){
      const next = [...streakData, { date: todayKey(), score }].slice(-14)
      setStreakData(next)
    } else {
      const next = [...streakData]
      next[next.length-1] = { ...last, score }
      setStreakData(next)
    }
  }, [day.habitsDone])
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5"/>Habitudes</CardTitle>
        <CardDescription>Construis ta régularité</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-2">
          {allHabits.map(h=> (
            <label key={h.id} className="flex items-center gap-3 rounded-xl border p-2">
              <Switch checked={!!day.habitsDone[h.id]} onCheckedChange={()=>toggle(h.id)} />
              <span>{h.name}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newHabit} onChange={e=>setNewHabit(e.target.value)} placeholder="Nouvelle habitude" onKeyDown={e=> e.key==='Enter' && addHabit()} />
          <Button onClick={addHabit} className="rounded-2xl"><Plus className="mr-2 h-4 w-4"/>Ajouter</Button>
        </div>
        <div className="pt-2">
          <StreakChart data={streakData} />
        </div>
      </CardContent>
    </Card>
  )
}

function Notes({ day, setDay }){
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5"/>Journal rapide</CardTitle>
        <CardDescription>3 lignes: ressentis · gratitude · next step</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea rows={6} value={day.notes} onChange={e=>setDay(d=>({...d, notes:e.target.value}))} placeholder="Comment tu te sens ? Qu'est-ce qui t'a fait du bien ? Quelle est la prochaine petite action ?" />
      </CardContent>
    </Card>
  )
}

export default function App(){
  const [blocks, setBlocks] = useState(()=> load('blocks', defaultBlocks))
  const [allHabits, setAllHabits] = useState(()=> load('allHabits', defaultHabits))
  const [days, setDays] = useState(()=> load('days', { [todayKey()]: emptyDay }))
  const [streakData, setStreakData] = useState(()=> load('streakData', []))
  const k = todayKey()
  const day = days[k] || emptyDay
  useEffect(()=> save('blocks', blocks), [blocks])
  useEffect(()=> save('allHabits', allHabits), [allHabits])
  useEffect(()=> save('days', days), [days])
  useEffect(()=> save('streakData', streakData), [streakData])

  const setDay = (updater)=> setDays(d=> ({ ...d, [k]: typeof updater==='function' ? updater(d[k] || emptyDay) : updater }))
  const resetToday = ()=> setDay({ ...emptyDay })

  const exportAll = ()=>{
    const data = { blocks, allHabits, days, streakData }
    const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `routine-${todayKey()}.json`; a.click(); URL.revokeObjectURL(url)
  }
  const importRef = useRef(null)
  const importAll = async (file)=>{
    if(!file) return
    const text = await file.text()
    try {
      const parsed = JSON.parse(text)
      if(parsed.blocks) setBlocks(parsed.blocks)
      if(parsed.allHabits) setAllHabits(parsed.allHabits)
      if(parsed.days) setDays(parsed.days)
      if(parsed.streakData) setStreakData(parsed.streakData)
    } catch(e){ alert('Fichier invalide') }
  }

  const completionScore = useMemo(()=>{
    const tasks = day.tasks.length ? day.tasks.filter(t=>t.done).length / day.tasks.length : 0
    const habits = allHabits.length ? Object.values(day.habitsDone).filter(Boolean).length / allHabits.length : 0
    const blocksDone = (()=>{
      const now = new Date()
      const nowStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      const total = blocks.length; if(!total) return 0
      const done = blocks.filter(b=> b.end <= nowStr).length
      return done / total
    })()
    const score = Math.round(100*(0.45*tasks + 0.35*habits + 0.2*blocksDone))
    return isNaN(score) ? 0 : score
  }, [day.tasks, day.habitsDone, allHabits.length, blocks])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Tableau de bord — Discipline quotidienne</h1>
            <p className="text-zinc-600">Salut Jonathan 👋 On avance pas à pas. Aujourd'hui : {k}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={resetToday} className="rounded-2xl"><RotateCcw className="mr-2 h-4 w-4"/>Réinitialiser le jour</Button>
            <Button variant="outline" onClick={exportAll} className="rounded-2xl"><Download className="mr-2 h-4 w-4"/>Exporter</Button>
            <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={e=> importAll(e.target.files?.[0]) } />
            <Button onClick={()=>importRef.current?.click()} className="rounded-2xl"><Upload className="mr-2 h-4 w-4"/>Importer</Button>
          </div>
        </div>
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5"/>Score de la journée</CardTitle>
              <CardDescription>Basé sur tâches, habitudes et progression des blocs</CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" strokeWidth="10" className="text-zinc-200" fill="none" stroke="currentColor"/>
                    <circle cx="60" cy="60" r="50" strokeWidth="10" className="text-emerald-500" fill="none" strokeDasharray={`${(2*Math.PI*50)*(completionScore/100)} ${(2*Math.PI*50)}`} strokeLinecap="round" stroke="currentColor"/>
                  </svg>
                  <div className="absolute inset-0 grid place-items-center text-xl font-semibold">{completionScore}%</div>
                </div>
                <div className="text-zinc-600">Astuce : coche 3 petites tâches faciles tôt dans la journée pour créer l'élan.</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <TimeBlocks blocks={blocks} setBlocks={setBlocks} />
            <div className="grid md:grid-cols-2 gap-6">
              <Pomodoro onSessionComplete={()=>{
                setDays(d=>{
                  const tday = d[k] || emptyDay
                  const t = { id: crypto.randomUUID(), title: 'Session focus terminée', done: true }
                  return { ...d, [k]: { ...tday, tasks: [...(tday.tasks||[]), t] } }
                })
              }}/>
              <Notes day={day} setDay={setDay} />
            </div>
          </div>
          <div className="space-y-6">
            <DailyTasks day={day} setDay={setDay} />
            <Habits day={day} setDay={setDay} allHabits={allHabits} setAllHabits={setAllHabits} streakData={streakData} setStreakData={setStreakData} />
          </div>
        </div>
        <div className="text-xs text-zinc-500 pt-2">
          Pro-tip : Ce tableau fonctionne 100% en local (localStorage). Utilise Export/Import pour sauvegarder ou transférer.
        </div>
      </div>
    </div>
  )
}
