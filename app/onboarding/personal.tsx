import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { useSettingsStore } from "@/store/settingsStore";
import { useRouter } from "expo-router";
import { ArrowRight, Check, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PersonalScreen() {
  const router = useRouter();
  const { isDarkMode, updatePersonalInfo } = useSettingsStore();
  const insets = useSafeAreaInsets();
  const theme = isDarkMode ? colors.dark : colors.light;

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const spiritualGoals = [
    "Grow closer to God",
    "Develop daily prayer habits",
    "Study scripture regularly",
    "Find inner peace",
    "Overcome temptation",
    "Serve others",
    "Build faith community",
    "Practice forgiveness",
  ];

  const handleContinue = () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your name to continue.");
      return;
    }

    updatePersonalInfo({
      name: name.trim(),
      age: age ? parseInt(age) : undefined,
      spiritualGoals: selectedGoals,
    });

    router.push("/onboarding/features");
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${theme.primary}15` },
            ]}
          >
            <User size={48} color={theme.primary} />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            Tell us about yourself
          </Text>
          <Text style={[styles.subtitle, { color: theme.secondary }]}>
            Help us personalize your spiritual journey
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              What&apos;s your name?
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={theme.secondary}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              Age (optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor={theme.secondary}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              What are your spiritual goals?
            </Text>
            <Text style={[styles.sublabel, { color: theme.secondary }]}>
              Select all that apply
            </Text>

            <View style={styles.goalsContainer}>
              {spiritualGoals.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.goalOption,
                    {
                      backgroundColor: selectedGoals.includes(goal)
                        ? theme.primary
                        : theme.card,
                      borderColor: selectedGoals.includes(goal)
                        ? theme.primary
                        : theme.border,
                    },
                  ]}
                  onPress={() => toggleGoal(goal)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.goalText,
                      {
                        color: selectedGoals.includes(goal)
                          ? "#FFFFFF"
                          : theme.text,
                      },
                    ]}
                  >
                    {goal}
                  </Text>
                  {selectedGoals.includes(goal) && (
                    <Check size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View
              style={[
                styles.dot,
                styles.activeDot,
                { backgroundColor: theme.primary },
              ]}
            />
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: theme.primary }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <ArrowRight size={20} color="#FFFFFF" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.quoteFont,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: typography.sizes.md,
    textAlign: "center",
    lineHeight: typography.sizes.md * 1.4,
  },
  formContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 8,
  },
  sublabel: {
    fontSize: typography.sizes.sm,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: typography.sizes.md,
  },
  goalsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  goalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  goalText: {
    fontSize: typography.sizes.sm,
    fontWeight: "500",
    marginRight: 8,
  },
  progressContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  progressDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    width: "100%",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.md,
    fontWeight: "600",
  },
  arrowIcon: {
    marginLeft: 8,
  },
});
