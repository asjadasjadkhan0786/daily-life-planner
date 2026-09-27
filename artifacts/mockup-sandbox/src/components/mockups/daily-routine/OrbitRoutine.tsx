import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Flame,
  Leaf,
  MapPin,
  Moon,
  MoreHorizontal,
  Play,
  Plus,
  Sparkles,
  Sun,
  Timer,
  Trophy,
  X,
} from "lucide-react";

type Task = { id: number; time: string; label: string; category: string; duration: string; done: boolean; color: string };

const initialTasks: Task[] = [
  { id: 1, time: "07:30", label: "Morning pages", category: "Mind", duration: "15 min", done: true, color: "#D5A13A" },
  { id: 2, time: "09:00", label: "Deep work block", category: "Work", duration: "90 min", done: false, color: "#2B7D70" },
  { id: 3, time: "12:45", label: "Walk outside", category: "Body", duration: "20 min", done: false, color: "#D16D50" },
  { id: 4, time: "18:30", label: "Cook something good", category: "Home", duration: "45 min", done: false, color: "#8067A8" },
];

const navItems = [
  { label: "Today", icon: Sun },
  { label: "Rhythms", icon: Activity },
  { label: "Reflect", icon: Sparkles },
];

export default function OrbitRoutine() {
  const [activeNav, setActiveNav] = useState("Today");
  const [tasks, setTasks] = useState(initialTasks);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const completed = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const progress = Math.round((completed / tasks.length) * 100);
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const toggleTask = (id: number) =>
    setTasks((items) => items.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));

  const addTask = () => {
    setTasks((items) => [
      ...items,
      { id: Date.now(), time: "20:00", label: "Wind down", category: "Rest", duration: "30 min", done: false, color: "#607C9A" },
    ]);
    setShowAdd(false);
  };

  return (
    <main className="min-h-screen bg-[#F4F0E8] text-[#243832]" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col md:flex-row">
        <aside className="flex w-full flex-col justify-between border-b border-[#D8D4CA] px-6 py-6 md:w-[226px] md:border-b-0 md:border-r md:px-7 md:py-9">
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-[13px] bg-[#243832] text-[#F4F0E8]"><Leaf size={17} /></div>
              <span className="text-[15px] font-bold tracking-[-0.03em]">daymark</span>
            </div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8D9387]">Your space</p>
            <nav className="flex gap-2 md:flex-col">
              {navItems.map(({ label, icon: Icon }) => (
                <button key={label} onClick={() => setActiveNav(label)} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-[13px] font-semibold transition-colors ${activeNav === label ? "bg-[#E1E8DE] text-[#243832]" : "text-[#7B8279] hover:bg-[#E9E5DC]"}`}>
                  <Icon size={17} strokeWidth={activeNav === label ? 2.4 : 1.8} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="hidden rounded-2xl bg-[#E8E3D9] p-4 md:block">
            <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8D9387]">This week</span><Trophy size={15} className="text-[#BD8830]" /></div>
            <div className="text-2xl font-semibold tracking-[-0.06em]">4 <span className="text-sm font-medium text-[#8D9387]">days in rhythm</span></div>
            <div className="mt-3 h-1.5 rounded-full bg-[#D4D0C7]"><div className="h-full w-[67%] rounded-full bg-[#BD8830]" /></div>
          </div>
        </aside>

        <section className="flex-1 px-5 py-7 sm:px-9 md:px-12 md:py-11">
          <header className="mb-10 flex items-start justify-between">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.17em] text-[#9A8C70]">Thursday, October 17</p>
              <h1 className="text-[34px] font-semibold leading-none tracking-[-0.075em] sm:text-[44px]">Make room for today.</h1>
              <p className="mt-3 text-[14px] text-[#7B8279]">A little structure, with plenty of air around it.</p>
            </div>
            <button onClick={() => setShowAdd(true)} aria-label="Add task" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#243832] text-[#F4F0E8] shadow-[0_7px_18px_rgba(36,56,50,.18)] transition-transform hover:-translate-y-0.5"><Plus size={19} /></button>
          </header>

          <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_285px]">
            <div className="relative overflow-hidden rounded-[28px] bg-[#2E665C] p-6 text-[#F3F0E7] sm:p-8">
              <div className="absolute -right-14 -top-24 h-64 w-64 rounded-full border border-[#8FB1A4]/30" />
              <div className="absolute -right-2 -top-12 h-40 w-40 rounded-full border border-[#8FB1A4]/30" />
              <div className="relative">
                <div className="mb-8 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B4D0C4]">The shape of your day</span><span className="rounded-full bg-[#3D766A] px-3 py-1 text-[10px] font-semibold">{completed}/{tasks.length} done</span></div>
                <div className="flex items-end gap-8">
                  <div><div className="text-[68px] font-semibold leading-[.85] tracking-[-0.09em]">{progress}<span className="text-3xl tracking-[-0.06em]">%</span></div><p className="mt-4 text-[13px] text-[#C3D9CF]">of today’s intentions</p></div>
                  <div className="mb-1 h-20 w-px bg-[#78A398]/45" />
                  <div className="mb-1 max-w-[185px] text-[13px] leading-5 text-[#C3D9CF]">You’ve already kept one promise to yourself. The next one is waiting.</div>
                </div>
                <div className="mt-8 h-2 overflow-hidden rounded-full bg-[#24534C]"><div className="h-full rounded-full bg-[#EBCB78] transition-all" style={{ width: `${progress}%` }} /></div>
              </div>
            </div>
            <div className="rounded-[28px] border border-[#D8D4CA] bg-[#F8F5EF] p-6">
              <div className="mb-6 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8C70]">Right now</span><Clock3 size={16} className="text-[#9A8C70]" /></div>
              <p className="text-[27px] font-semibold tracking-[-0.06em]">09:42</p>
              <p className="mt-1 text-[13px] text-[#7B8279]">Thursday morning · 14°C</p>
              <div className="mt-7 flex items-center gap-2 text-[12px] font-semibold text-[#2E665C]"><span className="h-2 w-2 rounded-full bg-[#D5A13A]" /> Deep work is next</div>
              <button onClick={() => toggleTask(2)} className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#E6ECE3] px-3 py-2.5 text-[12px] font-bold text-[#2E665C]">Mark as done <ArrowUpRight size={15} /></button>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_285px]">
            <section>
              <div className="mb-5 flex items-end justify-between"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8C70]">Your timeline</p><h2 className="text-[22px] font-semibold tracking-[-0.055em]">The gentle plan</h2></div><button onClick={() => setShowAdd(true)} className="text-[12px] font-bold text-[#2E665C] hover:underline">+ add moment</button></div>
              <div className="relative ml-1">
                <div className="absolute bottom-4 left-[50px] top-4 w-px bg-[#D8D4CA]" />
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="group relative flex items-center gap-4 rounded-2xl px-2 py-3 transition-colors hover:bg-[#EDE9E0]">
                      <span className="w-[38px] text-right font-mono text-[10px] font-bold text-[#9A8C70]">{task.time}</span>
                      <button onClick={() => toggleTask(task.id)} aria-label={`Complete ${task.label}`} className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all ${task.done ? "border-[#2E665C] bg-[#2E665C] text-[#F4F0E8]" : "border-[#C5C7BD] bg-[#F4F0E8] text-transparent hover:border-[#2E665C]"}`}><Check size={13} strokeWidth={3} /></button>
                      <div className={`min-w-0 flex-1 ${task.done ? "opacity-45" : ""}`}><p className={`text-[14px] font-bold ${task.done ? "line-through" : ""}`}>{task.label}</p><p className="mt-1 text-[11px] text-[#8D9387]">{task.category} <span className="px-1">·</span> {task.duration}</p></div>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: task.color }} />
                      <MoreHorizontal size={16} className="text-[#B6B6AB] opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-[24px] bg-[#E8E3D9] p-5">
                <div className="mb-5 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8D9387]">A small reset</p><Moon size={16} className="text-[#8067A8]" /></div>
                <p className="text-[17px] font-semibold leading-6 tracking-[-0.04em]">Run the loop,<br />not the race.</p>
                <p className="mt-3 text-[12px] leading-5 text-[#7B8279]">A 10-minute walk counts. Start where your energy is.</p>
                <button onClick={() => setRunning((value) => !value)} className={`mt-5 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[12px] font-bold ${running ? "bg-[#243832] text-[#F4F0E8]" : "bg-[#F4F0E8] text-[#243832]"}`}><span className="flex items-center gap-2">{running ? <Timer size={14} /> : <Play size={14} />}{running ? time : "Start a walk"}</span><ChevronRight size={15} /></button>
              </div>
              <div className="rounded-[24px] border border-[#D8D4CA] p-5">
                <div className="mb-4 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8C70]">Tiny wins</p><Flame size={16} className="text-[#D16D50]" /></div>
                <div className="flex items-center justify-between border-b border-[#E1DED6] pb-3"><span className="text-[12px] text-[#7B8279]">Current streak</span><strong className="text-[15px]">4 days</strong></div>
                <div className="flex items-center justify-between pt-3"><span className="flex items-center gap-2 text-[12px] text-[#7B8279]"><MapPin size={13} /> This month</span><strong className="text-[15px]">12.6 km</strong></div>
              </div>
            </aside>
          </div>
        </section>
      </div>
      {showAdd && <div className="fixed inset-0 z-20 grid place-items-center bg-[#243832]/25 p-5 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
        <div className="w-full max-w-sm rounded-[26px] bg-[#F8F5EF] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8C70]">Make room</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.06em]">Add a moment</h2></div><button onClick={() => setShowAdd(false)} className="text-[#7B8279]"><X size={19} /></button></div>
          <p className="mb-6 text-sm leading-5 text-[#7B8279]">Add a gentle landing point to the end of your day.</p>
          <button onClick={addTask} className="flex w-full items-center justify-between rounded-2xl bg-[#243832] px-4 py-3.5 text-sm font-bold text-[#F4F0E8]">Add “Wind down” <Plus size={17} /></button>
        </div>
      </div>}
    </main>
  );
}