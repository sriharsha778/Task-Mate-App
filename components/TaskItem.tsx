import { Feather } from "@expo/vector-icons";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Task } from "../storage/taskStorage";

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const priorityStyle = getPriorityStyle(task.priority);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <Pressable onPress={onDelete} style={styles.rightAction}>
        <Feather name="trash" size={24} color="white" />
        <Text style={styles.actionText}>Delete</Text>
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable onPress={onToggle} style={[styles.card, priorityStyle.card]}>
        <View style={styles.row}>
          <Feather
            name={task.completed ? "check-circle" : "circle"}
            size={24}
            color={task.completed ? "#4CAF50" : "#ccc"}
            style={{ marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.title, task.completed && styles.completedTitle]}
            >
              {task.title}
            </Text>
            {task.description ? (
              <Text style={styles.description}>{task.description}</Text>
            ) : null}
            {task.deadline ? (
              <Text style={styles.deadline}>
                📅 {new Date(task.deadline).toLocaleDateString()}
              </Text>
            ) : null}
            {task.category ? (
              <Text style={styles.category}>🏷️ {task.category}</Text>
            ) : null}
            {task.isDaily ? (
              <Text style={styles.dailyIndicator}>🔄 Daily Task</Text>
            ) : null}
          </View>
          <View style={[styles.priorityBadge, priorityStyle.badge]}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const getPriorityStyle = (priority: Task["priority"]) => {
  switch (priority) {
    case "High":
      return {
        card: { borderLeftWidth: 5, borderLeftColor: "#e74c3c" },
        badge: { backgroundColor: "#e74c3c" },
      };
    case "Medium":
      return {
        card: { borderLeftWidth: 5, borderLeftColor: "#f1c40f" },
        badge: { backgroundColor: "#f1c40f" },
      };
    case "Low":
      return {
        card: { borderLeftWidth: 5, borderLeftColor: "#2ecc71" },
        badge: { backgroundColor: "#2ecc71" },
      };
    default:
      return {
        card: { borderLeftWidth: 5, borderLeftColor: "#bdc3c7" },
        badge: { backgroundColor: "#bdc3c7" },
      };
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  deadline: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  category: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  dailyIndicator: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 2,
    fontWeight: "600",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  priorityText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  rightAction: {
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
    marginTop: 4,
  },
});
