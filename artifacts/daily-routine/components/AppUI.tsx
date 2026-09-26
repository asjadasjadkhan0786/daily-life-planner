import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Goal, GoalPeriod, Habit, Note, Priority, SleepRecord, Task } from '@/lib/types';

export function Screen({ children, refreshing = false, onRefresh }: { children: ReactNode; refreshing?: boolean; onRefresh?: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 102 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" refreshControl={undefined}>
    {children}
  </ScrollView>;
}

export function PageHeader({ eyebrow, title, subtitle, right }: { eyebrow?: string; title: string; subtitle?: string; right?: ReactNode }) {
  const colors = useColors();
  return <View style={styles.headerRow}><View style={styles.headerText}>{eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow.toUpperCase()}</Text> : null}<Text style={[styles.pageTitle, { color: colors.foreground }]}>{title}</Text>{subtitle ? <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}</View>{right}</View>;
}

export function Card({ children, style, tone = 'card' }: { children: ReactNode; style?: object; tone?: 'card' | 'primary' | 'soft' }) {
  const colors = useColors();
  const backgroundColor = tone === 'primary' ? colors.primary : tone === 'soft' ? colors.secondary : colors.card;
  return <View style={[styles.card, { backgroundColor, borderColor: colors.border }, style]}>{children}</View>;
}

export function IconButton({ icon, onPress, label, size = 40, tone = 'soft' }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; label?: string; size?: number; tone?: 'soft' | 'clear' | 'primary' }) {
  const colors = useColors();
  const backgroundColor = tone === 'primary' ? colors.primary : tone === 'soft' ? colors.secondary : 'transparent';
  const iconColor = tone === 'primary' ? colors.primaryForeground : colors.primary;
  return <Pressable accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [{ width: size, height: size, borderRadius: size / 2, backgroundColor, alignItems: 'center', justifyContent: 'center' }, pressed && styles.pressed]}><Ionicons name={icon} size={size * 0.46} color={iconColor} /></Pressable>;
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>{action && onAction ? <Pressable onPress={onAction}><Text style={[styles.actionText, { color: colors.primary }]}>{action}</Text></Pressable> : null}</View>;
}

export function ProgressBar({ value, height = 8 }: { value: number; height?: number }) {
  const colors = useColors();
  const width = `${Math.max(0, Math.min(1, value)) * 100}%` as `${number}%`;
  return <View style={[styles.progressTrack, { backgroundColor: colors.muted, height }]}><View style={[styles.progressFill, { backgroundColor: colors.primary, width }]} /></View>;
}

export function Pill({ label, active = false, onPress, color }: { label: string; active?: boolean; onPress?: () => void; color?: string }) {
  const colors = useColors();
  const content = <Text style={[styles.pillText, { color: active ? colors.primaryForeground : color ?? colors.secondaryForeground }]}>{label}</Text>;
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => [styles.pill, { backgroundColor: active ? colors.primary : colors.secondary, borderColor: active ? colors.primary : colors.border }, pressed && styles.pressed]}>{content}</Pressable> : <View style={[styles.pill, { backgroundColor: color ? color + '22' : colors.secondary, borderColor: 'transparent' }]}>{content}</View>;
}

export function Stat({ value, label, icon }: { value: string; label: string; icon: keyof typeof Ionicons.glyphMap }) {
  const colors = useColors();
  return <View style={[styles.stat, { backgroundColor: colors.secondary }]}><Ionicons name={icon} size={17} color={colors.primary} /><Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text></View>;
}

export function EmptyState({ icon, title, description, action, onAction }: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={[styles.empty, { backgroundColor: colors.secondary }]}><View style={[styles.emptyIcon, { backgroundColor: colors.card }]}><Ionicons name={icon} size={24} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{description}</Text>{action && onAction ? <Pressable onPress={onAction} style={[styles.smallButton, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>{action}</Text></Pressable> : null}</View>;
}

export function Field({ label, value, onChangeText, placeholder, multiline = false, keyboardType = 'default' }: { label: string; value: string; onChangeText: (text: string) => void; placeholder?: string; multiline?: boolean; keyboardType?: 'default' | 'numeric' }) {
  const colors = useColors();
  return <View style={styles.field}><Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} multiline={multiline} keyboardType={keyboardType} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }, multiline && styles.multiline]} /></View>;
}

export function ToggleRow({ label, description, value, onValueChange }: { label: string; description?: string; value: boolean; onValueChange: (value: boolean) => void }) {
  const colors = useColors();
  return <View style={styles.toggleRow}><View style={{ flex: 1 }}><Text style={[styles.bodyStrong, { color: colors.foreground }]}>{label}</Text>{description ? <Text style={[styles.caption, { color: colors.mutedForeground }]}>{description}</Text> : null}</View><Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.muted, true: colors.primary }} thumbColor={value ? colors.primaryForeground : colors.card} /></View>;
}

export function ModalSheet({ visible, title, onClose, children }: { visible: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}><View style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}><KeyboardAvoidingView behavior="padding" style={[styles.modalSheet, { backgroundColor: colors.card, paddingBottom: Math.max(insets.bottom, 18) }]}><View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: colors.foreground }]}>{title}</Text><IconButton icon="close" onPress={onClose} label="Close" tone="clear" /></View><ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView></KeyboardAvoidingView></View></Modal>;
}

function FormActions({ saveLabel, onSave, onDelete }: { saveLabel: string; onSave: () => void; onDelete?: () => void }) {
  const colors = useColors();
  return <View style={styles.formActions}>{onDelete ? <IconButton icon="trash-outline" onPress={onDelete} label="Delete" tone="clear" /> : <View />}{<Pressable onPress={onSave} style={({ pressed }) => [styles.saveButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>{saveLabel}</Text></Pressable>}</View>;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function TaskFormModal({ visible, task, onClose, onSave, onDelete }: { visible: boolean; task?: Task; onClose: () => void; onSave: (input: Omit<Task, 'id' | 'completedDates'>) => void; onDelete?: () => void }) {
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [time, setTime] = useState('09:00'); const [category, setCategory] = useState('Personal'); const [priority, setPriority] = useState<Priority>('Medium'); const [repeatDays, setRepeatDays] = useState<number[]>([0,1,2,3,4,5,6]); const [reminder, setReminder] = useState(false); const [notes, setNotes] = useState(''); const [duration, setDuration] = useState(''); const [enabled, setEnabled] = useState(true); const colors = useColors();
  useEffect(() => { if (visible) { setTitle(task?.title ?? ''); setDescription(task?.description ?? ''); setTime(task?.time ?? '09:00'); setCategory(task?.category ?? 'Personal'); setPriority(task?.priority ?? 'Medium'); setRepeatDays(task?.repeatDays ?? [0,1,2,3,4,5,6]); setReminder(task?.reminder ?? false); setNotes(task?.notes ?? ''); setDuration(task?.duration?.toString() ?? ''); setEnabled(task?.enabled ?? true); } }, [visible, task]);
  const save = () => { if (!title.trim()) return; onSave({ title: title.trim(), description: description.trim(), time, category: category.trim() || 'Personal', priority, repeatDays, reminder, notes: notes.trim(), duration: duration ? Number(duration) : undefined, enabled }); };
  return <ModalSheet visible={visible} title={task ? 'Edit task' : 'New task'} onClose={onClose}><Field label="Task name" value={title} onChangeText={setTitle} placeholder="e.g. Morning stretch" /><Field label="Description" value={description} onChangeText={setDescription} placeholder="What will make this easy?" multiline /><View style={styles.twoColumns}><View style={{ flex: 1 }}><Field label="Time" value={time} onChangeText={setTime} placeholder="09:00" /></View><View style={{ flex: 1 }}><Field label="Duration (min)" value={duration} onChangeText={setDuration} placeholder="30" keyboardType="numeric" /></View></View><Field label="Category" value={category} onChangeText={setCategory} placeholder="Wellness" /><Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Priority</Text><View style={styles.pillRow}>{(['Low', 'Medium', 'High'] as Priority[]).map((item) => <Pill key={item} label={item} active={priority === item} onPress={() => setPriority(item)} />)}</View><Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Repeat days</Text><View style={styles.pillRow}>{DAYS.map((day, index) => <Pill key={day + index} label={day} active={repeatDays.includes(index)} onPress={() => setRepeatDays((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index].sort())} />)}</View><ToggleRow label="Enable task" description="Show this task in your routine" value={enabled} onValueChange={setEnabled} /><ToggleRow label="Reminder" description="Schedule a daily local notification" value={reminder} onValueChange={setReminder} /><Field label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional details" multiline /><FormActions saveLabel={task ? 'Save changes' : 'Add task'} onSave={save} onDelete={onDelete} /></ModalSheet>;
}

export function HabitFormModal({ visible, habit, onClose, onSave }: { visible: boolean; habit?: Habit; onClose: () => void; onSave: (input: Omit<Habit, 'id' | 'completionDates'>) => void }) {
  const [name, setName] = useState(''); const [color, setColor] = useState<Habit['color']>('mint'); const colors = useColors();
  useEffect(() => { if (visible) { setName(habit?.name ?? ''); setColor(habit?.color ?? 'mint'); } }, [visible, habit]);
  return <ModalSheet visible={visible} title={habit ? 'Edit habit' : 'New habit'} onClose={onClose}><Field label="Habit name" value={name} onChangeText={setName} placeholder="e.g. Read 10 pages" /><Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Color marker</Text><View style={styles.pillRow}>{(['mint','sun','lavender','sky','peach'] as Habit['color'][]).map((item) => <Pill key={item} label={item} active={color === item} onPress={() => setColor(item)} />)}</View><FormActions saveLabel={habit ? 'Save habit' : 'Add habit'} onSave={() => { if (name.trim()) onSave({ name: name.trim(), color }); }} /></ModalSheet>;
}

export function NoteFormModal({ visible, note, onClose, onSave, onDelete }: { visible: boolean; note?: Note; onClose: () => void; onSave: (input: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void; onDelete?: () => void }) {
  const [title, setTitle] = useState(''); const [content, setContent] = useState(''); const [pinned, setPinned] = useState(false);
  useEffect(() => { if (visible) { setTitle(note?.title ?? ''); setContent(note?.content ?? ''); setPinned(note?.pinned ?? false); } }, [visible, note]);
  return <ModalSheet visible={visible} title={note ? 'Edit note' : 'New note'} onClose={onClose}><Field label="Title" value={title} onChangeText={setTitle} placeholder="A thought worth keeping" /><Field label="Note" value={content} onChangeText={setContent} placeholder="Write freely..." multiline /><ToggleRow label="Pin note" description="Keep this note at the top" value={pinned} onValueChange={setPinned} /><FormActions saveLabel={note ? 'Save note' : 'Add note'} onSave={() => { if (title.trim() && content.trim()) onSave({ title: title.trim(), content: content.trim(), pinned }); }} onDelete={onDelete} /></ModalSheet>;
}

export function GoalFormModal({ visible, goal, onClose, onSave }: { visible: boolean; goal?: Goal; onClose: () => void; onSave: (input: Omit<Goal, 'id'>) => void }) {
  const [title, setTitle] = useState(''); const [period, setPeriod] = useState<GoalPeriod>('daily'); const [target, setTarget] = useState('1'); const [progress, setProgress] = useState('0');
  useEffect(() => { if (visible) { setTitle(goal?.title ?? ''); setPeriod(goal?.period ?? 'daily'); setTarget(goal?.target.toString() ?? '1'); setProgress(goal?.progress.toString() ?? '0'); } }, [visible, goal]);
  return <ModalSheet visible={visible} title={goal ? 'Edit goal' : 'New goal'} onClose={onClose}><Field label="Goal" value={title} onChangeText={setTitle} placeholder="What matters this season?" /><Text style={{ marginBottom: 8 }}>Time frame</Text><View style={styles.pillRow}>{(['daily','weekly','monthly'] as GoalPeriod[]).map((item) => <Pill key={item} label={item} active={period === item} onPress={() => setPeriod(item)} />)}</View><View style={styles.twoColumns}><View style={{ flex: 1 }}><Field label="Target" value={target} onChangeText={setTarget} keyboardType="numeric" /></View><View style={{ flex: 1 }}><Field label="Progress" value={progress} onChangeText={setProgress} keyboardType="numeric" /></View></View><FormActions saveLabel={goal ? 'Save goal' : 'Add goal'} onSave={() => { if (title.trim()) onSave({ title: title.trim(), period, target: Math.max(1, Number(target) || 1), progress: Math.max(0, Number(progress) || 0) }); }} /></ModalSheet>;
}

export function SleepFormModal({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave: (input: Omit<SleepRecord, 'id'>) => void }) {
  const [bedtime, setBedtime] = useState('23:00'); const [wakeTime, setWakeTime] = useState('07:00'); const [duration, setDuration] = useState('8');
  return <ModalSheet visible={visible} title="Log sleep" onClose={onClose}><Field label="Bedtime" value={bedtime} onChangeText={setBedtime} placeholder="23:00" /><Field label="Wake-up time" value={wakeTime} onChangeText={setWakeTime} placeholder="07:00" /><Field label="Sleep duration (hours)" value={duration} onChangeText={setDuration} keyboardType="numeric" /><FormActions saveLabel="Save sleep" onSave={() => onSave({ date: new Date().toISOString().slice(0, 10), bedtime, wakeTime, durationHours: Math.max(0, Number(duration) || 0) })} /></ModalSheet>;
}

export function ReviewFormModal({ visible, values, onClose, onSave }: { visible: boolean; values: { goal: string; achieved: string; improve: string }; onClose: () => void; onSave: (values: { goal: string; achieved: string; improve: string }) => void }) {
  const [goal, setGoal] = useState(values.goal); const [achieved, setAchieved] = useState(values.achieved); const [improve, setImprove] = useState(values.improve);
  useEffect(() => { if (visible) { setGoal(values.goal); setAchieved(values.achieved); setImprove(values.improve); } }, [visible, values]);
  return <ModalSheet visible={visible} title="Monthly review" onClose={onClose}><Field label="My monthly goal" value={goal} onChangeText={setGoal} placeholder="What do I want to feel proud of?" multiline /><Field label="What I have achieved" value={achieved} onChangeText={setAchieved} placeholder="Celebrate the progress..." multiline /><Field label="What should I improve" value={improve} onChangeText={setImprove} placeholder="Choose one gentle adjustment..." multiline /><FormActions saveLabel="Save review" onSave={() => onSave({ goal, achieved, improve })} /></ModalSheet>;
}

export const styles = StyleSheet.create({
  screen: { paddingHorizontal: 20, gap: 18 }, headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }, headerText: { flex: 1 }, eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, marginBottom: 7 }, pageTitle: { fontSize: 30, fontWeight: '700', letterSpacing: -0.7 }, subtitle: { fontSize: 14, lineHeight: 20, marginTop: 6 }, sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }, sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2 }, actionText: { fontSize: 13, fontWeight: '700' }, card: { borderRadius: 22, padding: 16, borderWidth: 1, gap: 12 }, pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] }, progressTrack: { borderRadius: 20, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 20 }, pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }, pill: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }, pillText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' }, stat: { flex: 1, minWidth: 92, borderRadius: 16, padding: 12, gap: 4 }, statValue: { fontSize: 20, fontWeight: '700' }, statLabel: { fontSize: 11, fontWeight: '500' }, empty: { alignItems: 'center', borderRadius: 20, padding: 24, gap: 8 }, emptyIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }, emptyTitle: { fontSize: 16, fontWeight: '700' }, emptyText: { textAlign: 'center', fontSize: 13, lineHeight: 19, maxWidth: 260 }, smallButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, marginTop: 6 }, field: { gap: 7, marginBottom: 14 }, fieldLabel: { fontSize: 12, fontWeight: '700', marginBottom: 8 }, input: { minHeight: 46, borderWidth: 1, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 11, fontSize: 15 }, multiline: { minHeight: 92, textAlignVertical: 'top' }, bodyStrong: { fontSize: 15, fontWeight: '700' }, caption: { fontSize: 12, lineHeight: 17, marginTop: 3 }, toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 5, marginBottom: 10 }, modalBackdrop: { flex: 1, justifyContent: 'flex-end' }, modalSheet: { maxHeight: '92%', borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }, modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 5 }, modalTitle: { fontSize: 22, fontWeight: '700' }, modalContent: { padding: 20, paddingTop: 12, paddingBottom: 22 }, formActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }, saveButton: { paddingHorizontal: 18, paddingVertical: 13, borderRadius: 15 }, twoColumns: { flexDirection: 'row', gap: 10 },
});
