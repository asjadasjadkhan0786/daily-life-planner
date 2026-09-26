import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/lib/AppContext';
import { cancelTaskReminder, scheduleTaskReminder } from '@/lib/notifications';
import { Task, getDayNumber, todayKey } from '@/lib/types';
import { Card, EmptyState, IconButton, PageHeader, Pill, ProgressBar, Screen, SectionHeader, Stat, TaskFormModal, styles } from '@/components/AppUI';

function TaskRow({ task, completed, onToggle, onEdit }: { task: Task; completed: boolean; onToggle: () => void; onEdit: () => void }) {
  const colors = useColors();
  return <View style={[localStyles.taskRow, { borderBottomColor: colors.border }]}><Pressable testID={'task-' + task.id} onPress={onToggle} style={({ pressed }) => [localStyles.check, { borderColor: completed ? colors.primary : colors.border, backgroundColor: completed ? colors.primary : 'transparent' }, pressed && styles.pressed]}><Ionicons name="checkmark" size={16} color={completed ? colors.primaryForeground : 'transparent'} /></Pressable><Pressable onPress={onEdit} style={{ flex: 1 }}><View style={localStyles.taskTop}><Text style={[localStyles.taskTime, { color: colors.primary }]}>{task.time}</Text><Pill label={task.priority} color={task.priority === 'High' ? colors.accent : colors.secondary} /></View><Text style={[localStyles.taskTitle, { color: colors.foreground }, completed && localStyles.completedText]}>{task.title}</Text><Text style={[localStyles.taskMeta, { color: colors.mutedForeground }]}>{task.category}{task.duration ? ' · ' + task.duration + ' min' : ''}</Text></Pressable><IconButton icon="create-outline" onPress={onEdit} label="Edit task" tone="clear" size={34} /></View>;
}

export default function HomeScreen() {
  const colors = useColors();
  const { data, hydrated, toggleTask, addTask, updateTask, deleteTask } = useApp();
  const [editing, setEditing] = useState<Task | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const date = new Date();
  const today = todayKey();
  const day = getDayNumber(date);
  const todaysTasks = useMemo(() => data.tasks.filter((task) => task.enabled && task.repeatDays.includes(day)).sort((a, b) => a.time.localeCompare(b.time)), [data.tasks, day]);
  const completedCount = todaysTasks.filter((task) => task.completedDates.includes(today)).length;
  const progress = todaysTasks.length ? completedCount / todaysTasks.length : 0;
  const streak = useMemo(() => {
    let count = 0;
    const cursor = new Date();
    while (true) {
      const key = cursor.getFullYear() + '-' + String(cursor.getMonth() + 1).padStart(2, '0') + '-' + String(cursor.getDate()).padStart(2, '0');
      const done = data.tasks.filter((task) => task.enabled && task.repeatDays.includes(cursor.getDay())).every((task) => task.completedDates.includes(key));
      if (!done) break;
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
      if (count > 365) break;
    }
    return count;
  }, [data.tasks]);
  const saveTask = async (input: Omit<Task, 'id' | 'completedDates'>) => {
    if (editing) { updateTask(editing.id, input); if (input.reminder) await scheduleTaskReminder({ ...editing, ...input }); else await cancelTaskReminder(editing.id); }
    else { const id = addTask(input); if (input.reminder) await scheduleTaskReminder({ ...input, id, completedDates: [] }); }
    setFormOpen(false); setEditing(undefined);
  };
  if (!hydrated) return <Screen><EmptyState icon="hourglass-outline" title="Loading your day" description="Restoring your routine from this device." /></Screen>;
  return <Screen><PageHeader eyebrow="Daily Routine" title={'Good morning, ' + data.settings.name} subtitle={date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} right={<IconButton icon="add" onPress={() => { setEditing(undefined); setFormOpen(true); }} label="Add task" tone="primary" />} /><Card tone="primary" style={localStyles.progressCard}><View style={localStyles.progressCopy}><Text style={[localStyles.progressEyebrow, { color: colors.primaryForeground }]}>TODAY'S RHYTHM</Text><Text style={[localStyles.progressTitle, { color: colors.primaryForeground }]}>{completedCount} of {todaysTasks.length} complete</Text><Text style={[localStyles.progressCaption, { color: colors.primaryForeground }]}>{progress === 1 ? 'Everything important is done.' : (todaysTasks.length - completedCount) + ' small steps left today.'}</Text></View><View style={[localStyles.progressRing, { borderColor: colors.primaryForeground }]}><Text style={[localStyles.progressValue, { color: colors.primaryForeground }]}>{Math.round(progress * 100)}%</Text></View></Card><ProgressBar value={progress} height={10} /><View style={localStyles.statsRow}><Stat value={String(streak)} label="day streak" icon="flame-outline" /><Stat value={String(todaysTasks.length - completedCount)} label="remaining" icon="footsteps-outline" /><Stat value={String(data.habits.length)} label="habits" icon="leaf-outline" /></View><SectionHeader title="Today's routine" action="Add" onAction={() => { setEditing(undefined); setFormOpen(true); }} />{todaysTasks.length ? <Card>{todaysTasks.map((task) => <TaskRow key={task.id} task={task} completed={task.completedDates.includes(today)} onToggle={() => { Haptics.selectionAsync(); toggleTask(task.id); }} onEdit={() => { setEditing(task); setFormOpen(true); }} />)}</Card> : <EmptyState icon="checkmark-circle-outline" title="A clear day" description="Nothing is scheduled for today. Add a task when you are ready." action="Add task" onAction={() => { setEditing(undefined); setFormOpen(true); }} />}<SectionHeader title="A little encouragement" /><Card tone="soft"><View style={localStyles.quoteRow}><View style={[localStyles.quoteIcon, { backgroundColor: colors.card }]}><Ionicons name="sparkles-outline" size={20} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={[localStyles.quote, { color: colors.foreground }]}>Consistency is built from the next small thing.</Text><Text style={[localStyles.taskMeta, { color: colors.mutedForeground }]}>Keep the day kind and clear.</Text></View></View></Card><TaskFormModal visible={formOpen} task={editing} onClose={() => { setFormOpen(false); setEditing(undefined); }} onSave={saveTask} onDelete={editing ? () => { deleteTask(editing.id); void cancelTaskReminder(editing.id); setFormOpen(false); setEditing(undefined); } : undefined} /></Screen>;
}

const localStyles = StyleSheet.create({ progressCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 144, borderWidth: 0 }, progressCopy: { flex: 1, gap: 7 }, progressEyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, opacity: 0.82 }, progressTitle: { fontSize: 23, fontWeight: '700', letterSpacing: -0.4 }, progressCaption: { fontSize: 13, lineHeight: 18, opacity: 0.84 }, progressRing: { width: 82, height: 82, borderRadius: 41, borderWidth: 7, alignItems: 'center', justifyContent: 'center' }, progressValue: { fontSize: 19, fontWeight: '700' }, statsRow: { flexDirection: 'row', gap: 10 }, taskRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 13, borderBottomWidth: 1 }, check: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }, taskTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }, taskTime: { fontSize: 12, fontWeight: '700' }, taskTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 }, completedText: { textDecorationLine: 'line-through', opacity: 0.55 }, taskMeta: { fontSize: 12 }, quoteRow: { flexDirection: 'row', alignItems: 'center', gap: 12 }, quoteIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, quote: { fontSize: 15, lineHeight: 21, fontWeight: '600' },
});
