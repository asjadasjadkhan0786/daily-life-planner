import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AppData, createId, Goal, Habit, MonthlyReview, Note, RunningSession, SleepRecord, Task, todayKey, initialData } from '@/lib/types';

const STORAGE_KEY = 'daily-routine-data-v1';

type AppContextValue = {
  data: AppData;
  hydrated: boolean;
  addTask: (task: Omit<Task, 'id' | 'completedDates'>) => string;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string, date?: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completionDates'>) => void;
  toggleHabit: (id: string, date: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  addSleepRecord: (record: Omit<SleepRecord, 'id'>) => void;
  addRunningSession: (session: Omit<RunningSession, 'id'>) => void;
  saveReview: (review: MonthlyReview) => void;
  updateSettings: (settings: Partial<AppData['settings']>) => void;
  resetData: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const mergeStored = (stored: Partial<AppData>): AppData => ({
  ...initialData,
  ...stored,
  settings: { ...initialData.settings, ...(stored.settings ?? {}) },
  tasks: stored.tasks ?? initialData.tasks,
  habits: stored.habits ?? initialData.habits,
  notes: stored.notes ?? initialData.notes,
  goals: stored.goals ?? initialData.goals,
  sleepRecords: stored.sleepRecords ?? [],
  runningSessions: stored.runningSessions ?? [],
  monthlyReviews: stored.monthlyReviews ?? initialData.monthlyReviews,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) {
        try { setData(mergeStored(JSON.parse(value) as Partial<AppData>)); } catch { setData(initialData); }
      }
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => undefined);
  }, [data, hydrated]);

  const update = (updater: (current: AppData) => AppData) => setData((current) => updater(current));
  const today = todayKey();

  const value = useMemo<AppContextValue>(() => ({
    data, hydrated,
    addTask: (task) => { const id = createId('task'); update((current) => ({ ...current, tasks: [...current.tasks, { ...task, id, completedDates: [] }] })); return id; },
    updateTask: (id, patch) => update((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, ...patch } : task) })),
    deleteTask: (id) => update((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) })),
    toggleTask: (id, date = today) => update((current) => ({ ...current, tasks: current.tasks.map((task) => task.id !== id ? task : { ...task, completedDates: task.completedDates.includes(date) ? task.completedDates.filter((item) => item !== date) : [...task.completedDates, date] }) })),
    addHabit: (habit) => update((current) => ({ ...current, habits: [...current.habits, { ...habit, id: createId('habit'), completionDates: [] }] })),
    toggleHabit: (id, date) => update((current) => ({ ...current, habits: current.habits.map((habit) => habit.id !== id ? habit : { ...habit, completionDates: habit.completionDates.includes(date) ? habit.completionDates.filter((item) => item !== date) : [...habit.completionDates, date] }) })),
    addNote: (note) => { const now = new Date().toISOString(); update((current) => ({ ...current, notes: [{ ...note, id: createId('note'), createdAt: now, updatedAt: now }, ...current.notes] })); },
    updateNote: (id, patch) => update((current) => ({ ...current, notes: current.notes.map((note) => note.id !== id ? note : { ...note, ...patch, updatedAt: new Date().toISOString() }) })),
    deleteNote: (id) => update((current) => ({ ...current, notes: current.notes.filter((note) => note.id !== id) })),
    addGoal: (goal) => update((current) => ({ ...current, goals: [...current.goals, { ...goal, id: createId('goal') }] })),
    updateGoal: (id, patch) => update((current) => ({ ...current, goals: current.goals.map((goal) => goal.id !== id ? goal : { ...goal, ...patch }) })),
    addSleepRecord: (record) => update((current) => ({ ...current, sleepRecords: [{ ...record, id: createId('sleep') }, ...current.sleepRecords.filter((item) => item.date !== record.date)] })),
    addRunningSession: (session) => update((current) => ({ ...current, runningSessions: [{ ...session, id: createId('run') }, ...current.runningSessions] })),
    saveReview: (review) => update((current) => ({ ...current, monthlyReviews: [...current.monthlyReviews.filter((item) => item.month !== review.month), review] })),
    updateSettings: (settings) => update((current) => ({ ...current, settings: { ...current.settings, ...settings } })),
    resetData: () => setData(initialData),
  }), [data, hydrated]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used within AppProvider');
  return value;
}
