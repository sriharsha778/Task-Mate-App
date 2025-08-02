import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleNotification } from "../utils/notifications";

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: "High" | "Medium" | "Low";
  category?: string;
  completed: boolean;
  isDaily?: boolean;
  lastResetDate?: string;
}

const TASKS_KEY = "TASKS";

export const getTasks = async (): Promise<Task[]> => {
  const data = await AsyncStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const deleteTask = async (id: string): Promise<void> => {
  const tasks = await getTasks();
  const updated = tasks.filter((t) => t.id !== id);
  await saveTasks(updated);
};

export const resetDailyTasks = async (): Promise<void> => {
  const tasks = await getTasks();
  const today = new Date().toDateString();

  const updated = tasks.map((task) => {
    if (task.isDaily && task.lastResetDate !== today) {
      return {
        ...task,
        completed: false,
        lastResetDate: today,
      };
    }
    return task;
  });

  await saveTasks(updated);
};

export const checkDeadlinesAndNotify = async (): Promise<void> => {
  const tasks = await getTasks();
  const now = new Date();

  tasks.forEach((task) => {
    if (task.deadline && !task.completed) {
      const deadline = new Date(task.deadline);
      const timeDiff = deadline.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      // Notify if deadline is within 24 hours
      if (hoursDiff <= 24 && hoursDiff > 0) {
        scheduleNotification(task);
      }
    }
  });
};
