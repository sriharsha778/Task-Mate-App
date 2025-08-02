import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TaskItem from "../components/TaskItem";
import {
  Task,
  checkDeadlinesAndNotify,
  getTasks,
  resetDailyTasks,
  saveTasks,
} from "../storage/taskStorage";
import { registerBackgroundTask } from "../utils/backgroundTasks";
import {
  cancelTaskNotification,
  scheduleDailyReset,
  scheduleNotification,
} from "../utils/notifications";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending"
  );
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  useEffect(() => {
    loadTasks();
    initializeApp();
  }, []);

  // ...

  const initializeApp = async () => {
    // Reset daily tasks if needed
    await resetDailyTasks();

    // Check for approaching deadlines and schedule notifications
    await checkDeadlinesAndNotify();

    // Schedule daily reset
    await scheduleDailyReset();

    // Register background task
    await registerBackgroundTask();
  };

  const loadTasks = async () => {
    const saved = await getTasks();
    setTasks(sortTasks(saved));
  };

  const sortTasks = (list: Task[]) => {
    return [...list].sort((a, b) => {
      // First sort by completion status (incomplete tasks first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then sort by priority (High > Medium > Low)
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // Finally sort by deadline (earliest first) if both tasks have deadlines
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }

      // Tasks without deadlines come after those with deadlines
      if (a.deadline && !b.deadline) return -1;
      if (!a.deadline && b.deadline) return 1;

      return 0;
    });
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    await saveTasks(updated);
    setTasks(sortTasks(updated));

    // Handle notifications
    if (task) {
      if (task.completed) {
        // Task was completed, cancel any pending notifications
        await cancelTaskNotification(id);
      } else {
        // Task was uncompleted, reschedule notification if it has a deadline
        if (task.deadline) {
          await scheduleNotification(task);
        }
      }
    }
  };

  const confirmToggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task?.completed) {
      toggleTask(id);
    } else {
      setSelectedTaskId(id);
      setConfirmVisible(true);
    }
  };

  const confirmCompletion = () => {
    if (selectedTaskId) {
      toggleTask(selectedTaskId);
      setSelectedTaskId(null);
      setConfirmVisible(false);
    }
  };

  const cancelCompletion = () => {
    setSelectedTaskId(null);
    setConfirmVisible(false);
  };

  const handleDelete = async (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    await saveTasks(updated);
    setTasks(updated);

    // Cancel any pending notifications for the deleted task
    await cancelTaskNotification(id);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const incomplete = total - completed;
    const daily = tasks.filter((t) => t.isDaily).length;
    const highPriority = tasks.filter(
      (t) => t.priority === "High" && !t.completed
    ).length;

    return { total, completed, incomplete, daily, highPriority };
  };

  const stats = getTaskStats();

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "pending") {
      return !task.completed;
    } else {
      return task.completed;
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <StatusBar hidden={false} />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DailyTaskMate</Text>
      </View>

      {/* Task Statistics Bar */}
      <View style={styles.taskBar}>
        <Text style={styles.taskBarTitle}>
          Task Overview ({tasks.length} tasks)
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.incomplete}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.daily}</Text>
            <Text style={styles.statLabel}>Daily</Text>
          </View>
          <View
            style={[
              styles.statItem,
              stats.highPriority > 0 && styles.highPriorityItem,
            ]}
          >
            <Text
              style={[
                styles.statNumber,
                stats.highPriority > 0 && styles.highPriorityText,
              ]}
            >
              {stats.highPriority}
            </Text>
            <Text
              style={[
                styles.statLabel,
                stats.highPriority > 0 && styles.highPriorityText,
              ]}
            >
              High Priority
            </Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            Pending ({stats.incomplete})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed ({stats.completed})
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => confirmToggleTask(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === "pending"
                ? "No pending tasks. Great job!"
                : "No completed tasks yet."}
            </Text>
          </View>
        }
      />
      <Pressable style={styles.fab} onPress={() => router.push("/add-task")}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Complete Task</Text>
            <Text style={styles.modalText}>
              Did you really complete this task?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={cancelCompletion}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={confirmCompletion}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: "#ccc",
    borderRadius: 6,
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: {
    color: "white",
    fontSize: 30,
    lineHeight: 32,
  },
  taskBar: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  taskBarTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  highPriorityItem: {
    backgroundColor: "#fff5f5",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  highPriorityText: {
    color: "#e74c3c",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007AFF",
    backgroundColor: "#f8f9fa",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#007AFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
