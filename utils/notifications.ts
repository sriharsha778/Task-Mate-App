import * as Notifications from 'expo-notifications';
import { Task } from '../storage/taskStorage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

export const scheduleNotification = async (task: Task): Promise<void> => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  const deadline = new Date(task.deadline!);
  const now = new Date();
  const timeDiff = deadline.getTime() - now.getTime();
  
  // Don't schedule if deadline has passed
  if (timeDiff <= 0) return;

  // Cancel any existing notifications for this task
  await Notifications.cancelScheduledNotificationAsync(task.id);

  // Schedule notification
  await Notifications.scheduleNotificationAsync({
    identifier: task.id,
    content: {
      title: 'Task Deadline Approaching!',
      body: `"${task.title}" is due soon. Priority: ${task.priority}`,
      data: { taskId: task.id },
    },
    trigger: {
      date: deadline,
    },
  });
};

export const cancelTaskNotification = async (taskId: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(taskId);
};

export const scheduleDailyReset = async (): Promise<void> => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  // Schedule daily reset at 12:00 AM
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  await Notifications.scheduleNotificationAsync({
    identifier: 'daily-reset',
    content: {
      title: 'Daily Tasks Reset',
      body: 'Your daily tasks have been reset for the new day!',
      data: { type: 'daily-reset' },
    },
    trigger: {
      hour: 0,
      minute: 0,
      repeats: true,
    },
  });
}; 