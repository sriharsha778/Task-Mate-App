import * as TaskManager from "expo-task-manager";
import {
  checkDeadlinesAndNotify,
  resetDailyTasks,
} from "../storage/taskStorage";

const BACKGROUND_TASK_NAME = "background-task";

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    // Reset daily tasks
    await resetDailyTasks();

    // Check deadlines and schedule notifications
    await checkDeadlinesAndNotify();

    return { success: true };
  } catch (error) {
    console.error("Background task failed:", error);
    return { success: false, error: error.message };
  }
});

export const registerBackgroundTask = async (): Promise<void> => {
  try {
    await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
  } catch (error) {
    console.log("Background task not registered, registering now...");
    // Note: In a real app, you would register this with your app's background task system
  }
};
