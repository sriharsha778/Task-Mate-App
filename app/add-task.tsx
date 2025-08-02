import { generateId } from "@/utils/generateId";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useReducer, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getTasks, saveTasks, Task } from "../storage/taskStorage";

export default function AddTaskScreen() {
  const initialState: Omit<Task, "id"> = {
    title: "",
    description: "",
    deadline: new Date().toISOString(),
    priority: "Low",
    category: "Personal",
    completed: false,
    isDaily: false,
    lastResetDate: undefined,
  };

  type Action = {
    type: keyof typeof initialState;
    payload: any;
  };

  function reducer(state: typeof initialState, action: Action) {
    return { ...state, [action.type]: action.payload };
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  const handleAdd = async () => {
    try {
      const id = await generateId();
      const newTask: Task = {
        id,
        ...state,
        lastResetDate: state.isDaily ? new Date().toDateString() : undefined,
        completed: false,
      };

      const existingTasks = await getTasks();
      await saveTasks([...existingTasks, newTask]);
      router.back();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const showMode = (mode: "date" | "time") => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      dispatch({ type: "deadline", payload: selectedDate.toISOString() });
    }
  };

  const deadlineDate = new Date(state.deadline || new Date().toISOString());

  return (
    <View style={styles.container}>
      {/* Custom Header */}

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Title"
          placeholderTextColor="#888"
          value={state.title}
          onChangeText={(e) => dispatch({ type: "title", payload: e })}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor="#888"
          value={state.description}
          onChangeText={(e) => dispatch({ type: "description", payload: e })}
          style={[styles.input, { height: 100 }]}
          multiline
        />

        <Text style={styles.label}>Priority:</Text>
        <Picker
          selectedValue={state.priority}
          onValueChange={(value) =>
            dispatch({ type: "priority", payload: value })
          }
          style={[styles.picker, { color: "#000" }]} // <-- Add color explicitly
        >
          <Picker.Item label="High" value="High" color="#000" />
          <Picker.Item label="Medium" value="Medium" color="#000" />
          <Picker.Item label="Low" value="Low" color="#000" />
        </Picker>

        <Text style={styles.label}>Category:</Text>
        <Picker
          selectedValue={state.category}
          onValueChange={(value) =>
            dispatch({ type: "category", payload: value })
          }
          style={[styles.picker, { color: "#000" }]} // <-- Add color explicitly
        >
          <Picker.Item label="Personal" value="Personal" color="#000" />
          <Picker.Item label="Work" value="Work" color="#000" />
          <Picker.Item label="Learn" value="Learn" color="#000" />
        </Picker>

        <Text style={styles.label}>Deadline:</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable onPress={() => showMode("date")} style={styles.dateButton}>
            <Text style={styles.dateText}>
              📅 {deadlineDate.toLocaleDateString()}
            </Text>
          </Pressable>
          <Pressable onPress={() => showMode("time")} style={styles.dateButton}>
            <Text style={styles.dateText}>
              ⏰{" "}
              {deadlineDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Pressable>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Daily Task:</Text>
          <Pressable
            style={[styles.switch, state.isDaily && styles.switchActive]}
            onPress={() =>
              dispatch({ type: "isDaily", payload: !state.isDaily })
            }
          >
            <Text style={styles.switchText}>
              {state.isDaily ? "🔄 Yes" : "❌ No"}
            </Text>
          </Pressable>
        </View>

        {showPicker && (
          <DateTimePicker
            mode={pickerMode}
            display={Platform.OS === "ios" ? "inline" : "default"}
            value={deadlineDate}
            onChange={onChange}
          />
        )}
      </View>

      {/* Save Button fixed at bottom */}
      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={handleAdd}>
          <Text style={styles.saveButtonText}>Save Task</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 60,
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  backButtonText: {
    transform: "scale(1.5)",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    position: "absolute", // Center absolutely
    left: 0,
    right: 0,
    textAlign: "center", // Center the text itself
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  formContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  switch: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
  },
  switchActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  switchText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  saveButton: {
    paddingVertical: 14,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  saveButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
