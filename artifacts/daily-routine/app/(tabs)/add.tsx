import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/lib/AppContext';
import { scheduleTaskReminder } from '@/lib/notifications';
import { Task, Habit, Note, Goal } from '@/lib/types';
import { GoalFormModal, HabitFormModal, NoteFormModal, PageHeader, Screen, SleepFormModal, TaskFormModal, Card, styles } from '@/components/AppUI';

const actions: { key: string; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'task', title: 'Add task', subtitle: 'Build your routine', icon: 'checkmark-circle-outline' },
  { key: 'habit', title: 'Add habit', subtitle: 'Track a repeatable win', icon: 'leaf-outline' },
  { key: 'note', title: 'Add note', subtitle: 'Capture a thought', icon: 'document-text-outline' },
  { key: 'goal', title: 'Add goal', subtitle: 'Name what matters', icon: 'flag-outline' },
  { key: 'sleep', title: 'Log sleep', subtitle: 'Keep your rest visible', icon: 'moon-outline' },
];

export default function AddScreen() {
  const colors = useColors();
  const { addTask, addHabit, addNote, addGoal, addSleepRecord } = useApp();
  const [modal, setModal] = useState<string | null>(null);
  const saveTask = async (input: Parameters<typeof addTask>[0]) => { const id = addTask(input); if (input.reminder) await scheduleTaskReminder({ ...input, id, completedDates: [] }); setModal(null); };
  return <Screen><PageHeader eyebrow="Create space" title="What would you like to add?" subtitle="A simple capture point for the things that keep your days moving." /><View style={localStyles.grid}>{actions.map((item) => <Pressable key={item.key} onPress={() => setModal(item.key)} style={({ pressed }) => [localStyles.actionWrap, pressed && styles.pressed]}><Card style={localStyles.actionCard}><View style={[localStyles.actionIcon, { backgroundColor: colors.secondary }]}><Ionicons name={item.icon} size={23} color={colors.primary} /></View><Text style={[localStyles.actionTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[localStyles.actionSubtitle, { color: colors.mutedForeground }]}>{item.subtitle}</Text><Ionicons name="arrow-forward" size={17} color={colors.primary} style={{ marginTop: 4 }} /></Card></Pressable>)}</View><Card tone="soft" style={localStyles.tipCard}><Ionicons name="sparkles-outline" size={21} color={colors.primary} /><View style={{ flex: 1 }}><Text style={[localStyles.tipTitle, { color: colors.foreground }]}>Make it easy to begin</Text><Text style={[localStyles.actionSubtitle, { color: colors.mutedForeground }]}>The best plan is one you can return to on an ordinary day.</Text></View></Card><TaskFormModal visible={modal === 'task'} onClose={() => setModal(null)} onSave={saveTask} /><HabitFormModal visible={modal === 'habit'} onClose={() => setModal(null)} onSave={(input) => { addHabit(input); setModal(null); }} /><NoteFormModal visible={modal === 'note'} onClose={() => setModal(null)} onSave={(input) => { addNote(input); setModal(null); }} /><GoalFormModal visible={modal === 'goal'} onClose={() => setModal(null)} onSave={(input) => { addGoal(input); setModal(null); }} /><SleepFormModal visible={modal === 'sleep'} onClose={() => setModal(null)} onSave={(input) => { addSleepRecord(input); setModal(null); }} /></Screen>;
}

const localStyles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, actionWrap: { width: '48%' }, actionCard: { minHeight: 162, justifyContent: 'space-between', padding: 15 }, actionIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, actionTitle: { fontSize: 15, fontWeight: '700', marginTop: 10 }, actionSubtitle: { fontSize: 12, lineHeight: 17 }, tipCard: { flexDirection: 'row', alignItems: 'center', gap: 12 }, tipTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
});
