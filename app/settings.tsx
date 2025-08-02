// ✅ SettingsScreen.tsx

import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { ThemeType } from "../utils/theme";

export default function SettingsScreen() {
  const { theme, themeType, setThemeType } = useTheme();

  const themeOptions: {
    type: ThemeType;
    label: string;
    description: string;
  }[] = [
    {
      type: "system",
      label: "System",
      description: "Follows your device theme",
    },
    {
      type: "light",
      label: "Light",
      description: "Always use light theme",
    },
    {
      type: "dark",
      label: "Dark",
      description: "Always use dark theme",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.surface, borderBottomColor: theme.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Settings
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance
          </Text>

          {themeOptions.map((option) => (
            <Pressable
              key={option.type}
              style={[
                styles.option,
                { backgroundColor: theme.surface, borderColor: theme.border },
                themeType === option.type && { borderColor: theme.primary },
              ]}
              onPress={() => setThemeType(option.type)}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionLabel, { color: theme.text }]}>
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    { color: theme.textSecondary },
                  ]}
                >
                  {option.description}
                </Text>
              </View>
              {themeType === option.type && (
                <View
                  style={[styles.checkmark, { backgroundColor: theme.primary }]}
                />
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
          <View
            style={[
              styles.aboutCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.appName, { color: theme.text }]}>
              DailyTaskMate
            </Text>
            <Text style={[styles.version, { color: theme.textSecondary }]}>
              Version 1.0.0
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              A simple and elegant task management app with theme support.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  aboutCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
