export type Priority = 'Low' | 'Medium' | 'High';
export type GoalPeriod = 'daily' | 'weekly' | 'monthly';

export type Task = {
  id: string;
  title: string;
  description: string;
  time: string;
  category: string;
  priority: Priority;
  repeatDays: number[];
  reminder: boolean;
  notes: string;
  duration?: number;
  enabled: boolean;
  completedDates: string[];
};

export type Habit = {
  id: string;
  name: string;
  color: 'mint' | 'sun' | 'lavender' | 'sky' | 'peach';
  completionDates: string[];
};

export type Note = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Goal = {
  id: string;
  title: string;
  period: GoalPeriod;
  target: number;
  progress: number;
};

export type SleepRecord = {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  durationHours: number;
};

export type RunningSession = {
  id: string;
  date: string;
  durationMinutes: number;
  distanceKm: number;
  pace: string;
  calories: number;
};

export type MonthlyReview = {
  month: string;
  goal: string;
  achieved: string;
  improve: string;
};

export type Settings = {
  name: string;
  language: 'English' | 'Hindi';
  darkMode: boolean;
  notifications: boolean;
  dailyGoal: number;
  sleepGoal: number;
  runningGoal: number;
};

export type AppData = {
  tasks: Task[];
  habits: Habit[];
  notes: Note[];
  goals: Goal[];
  sleepRecords: SleepRecord[];
  runningSessions: RunningSession[];
  monthlyReviews: MonthlyReview[];
  settings: Settings;
};

export const createId = (prefix: string) =>
  prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const todayKey = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
};

export const monthKey = (date = new Date()) => {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
};

export const getDayNumber = (date = new Date()) => date.getDay();

export const initialData: AppData = {
  tasks: [
    { id: 'task-hydrate', title: 'Drink a glass of water', description: 'Start the morning hydrated.', time: '07:30', category: 'Wellness', priority: 'High', repeatDays: [0,1,2,3,4,5,6], reminder: false, notes: '', duration: 5, enabled: true, completedDates: [] },
    { id: 'task-focus', title: 'Focused work block', description: 'Protect one quiet block for your most important work.', time: '09:00', category: 'Work', priority: 'High', repeatDays: [1,2,3,4,5], reminder: false, notes: '', duration: 60, enabled: true, completedDates: [] },
    { id: 'task-walk', title: 'Step outside for a walk', description: 'A little movement and fresh air.', time: '17:30', category: 'Movement', priority: 'Medium', repeatDays: [0,1,2,3,4,5,6], reminder: false, notes: '', duration: 20, enabled: true, completedDates: [] },
    { id: 'task-plan', title: 'Plan tomorrow', description: 'Close the day with a clear next step.', time: '21:30', category: 'Mindset', priority: 'Low', repeatDays: [0,1,2,3,4,5,6], reminder: false, notes: '', duration: 10, enabled: true, completedDates: [] },
  ],
  habits: [
    { id: 'habit-water', name: 'Hydration', color: 'sky', completionDates: [] },
    { id: 'habit-move', name: 'Movement', color: 'mint', completionDates: [] },
    { id: 'habit-read', name: 'Read 10 pages', color: 'lavender', completionDates: [] },
    { id: 'habit-sleep', name: 'Sleep by 11', color: 'peach', completionDates: [] },
  ],
  notes: [
    { id: 'note-start', title: 'A small intention', content: 'Make today feel lighter by finishing one important thing before opening the noise.', pinned: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  goals: [
    { id: 'goal-daily', title: 'Complete my routine', period: 'daily', target: 4, progress: 0 },
    { id: 'goal-weekly', title: 'Move 4 times', period: 'weekly', target: 4, progress: 1 },
    { id: 'goal-monthly', title: 'Read consistently', period: 'monthly', target: 20, progress: 3 },
  ],
  sleepRecords: [],
  runningSessions: [],
  monthlyReviews: [{ month: monthKey(), goal: '', achieved: '', improve: '' }],
  settings: { name: 'Your day', language: 'English', darkMode: false, notifications: false, dailyGoal: 4, sleepGoal: 8, runningGoal: 12 },
};
