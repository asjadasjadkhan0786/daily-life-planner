import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '@/lib/types';

export async function requestNotificationPermission() {
  if (Platform.OS === 'web') return false;
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleTaskReminder(task: Task) {
  if (Platform.OS === 'web' || !task.reminder || !task.enabled) return null;
  const granted = await requestNotificationPermission();
  if (!granted) return null;
  const parts = task.time.split(':').map(Number);
  const hour = Number.isFinite(parts[0]) ? parts[0] : 9;
  const minute = Number.isFinite(parts[1]) ? parts[1] : 0;
  await cancelTaskReminder(task.id);
  const content = { title: task.title, body: 'A small step for your Daily Routine.', data: { taskId: task.id } };
  const days = task.repeatDays.length ? task.repeatDays : [0, 1, 2, 3, 4, 5, 6];
  const ids = await Promise.all(days.map((day) => Notifications.scheduleNotificationAsync({
    content,
    trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: day + 1, hour, minute },
  })));
  return ids[0] ?? null;
}

export async function cancelTaskReminder(taskId: string) {
  if (Platform.OS === 'web') return;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(scheduled.filter((item) => item.content.data?.taskId === taskId).map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)));
}
