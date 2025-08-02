import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          {/* Default: hide headers */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-task"
            options={{ headerShown: true, title: "Add Task" }}
          />
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
