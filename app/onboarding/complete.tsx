import { typography } from "@/constants/typography";
import { useSettingsStore } from "@/store/settingsStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowRight, CheckCircle, Heart } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CompleteScreen() {
  const router = useRouter();
  const { isDarkMode, completeOnboarding, personalInfo } = useSettingsStore();
  const insets = useSafeAreaInsets();

  const handleComplete = () => {
    completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient
      colors={["#2E5BBA", "#4A90E2", "#6BB6FF"]}
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <CheckCircle size={64} color="#FFFFFF" fill="#FFFFFF" />
          </View>

          <Text style={styles.title}>
            {personalInfo.name ? `Welcome, ${personalInfo.name}!` : "Welcome!"}
          </Text>
          <Text style={styles.subtitle}>Your spiritual journey begins now</Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            &quot;Trust in the Lord with all your heart and lean not on your own
            understanding; in all your ways submit to him, and he will make your
            paths straight.&quot;
          </Text>
          <Text style={styles.attribution}>- Proverbs 3:5-6</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Heart size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.featureText}>Daily spiritual growth</Text>
          </View>

          <View style={styles.featureItem}>
            <CheckCircle size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.featureText}>Track your progress</Text>
          </View>

          <View style={styles.featureItem}>
            <Heart size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.featureText}>Emergency spiritual support</Text>
          </View>
        </View>

        <View style={styles.encouragementContainer}>
          <Text style={styles.encouragementText}>
            Remember: Every step you take in faith brings you closer to God.
            Start with just one teaching today.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Begin Your Journey</Text>
          <ArrowRight size={20} color="#2E5BBA" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontFamily: typography.quoteFont,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: typography.sizes.xl,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  messageContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  message: {
    fontSize: typography.sizes.lg,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: typography.sizes.lg * 1.4,
    fontStyle: "italic",
    marginBottom: 12,
  },
  attribution: {
    fontSize: typography.sizes.md,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    fontWeight: "500",
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: typography.sizes.md,
    marginLeft: 12,
    fontWeight: "500",
  },
  encouragementContainer: {
    paddingHorizontal: 16,
  },
  encouragementText: {
    fontSize: typography.sizes.md,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: typography.sizes.md * 1.5,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    color: "#2E5BBA",
    fontSize: typography.sizes.lg,
    fontWeight: "700",
  },
  arrowIcon: {
    marginLeft: 12,
  },
});
