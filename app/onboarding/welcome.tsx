import { typography } from "@/constants/typography";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Award, Heart, Users } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    router.push("/onboarding/personal");
  };

  const handleSkip = () => {
    router.replace("/onboarding/complete");
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
        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            <Heart size={48} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Voice of the Shepherd</Text>
        <Text style={styles.subtitle}>Your spiritual journey starts here</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Users size={32} color="#FFFFFF" />
            <Text style={styles.statNumber}>Millions</Text>
            <Text style={styles.statLabel}>of believers</Text>
          </View>

          <View style={styles.statItem}>
            <Award size={32} color="#FFFFFF" />
            <Text style={styles.statNumber}>96%</Text>
            <Text style={styles.statLabel}>satisfaction</Text>
          </View>

          <View style={styles.statItem}>
            <Heart size={32} color="#FFFFFF" />
            <Text style={styles.statNumber}>Faith</Text>
            <Text style={styles.statLabel}>based approach</Text>
          </View>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitText}>• Daily spiritual teachings</Text>
          <Text style={styles.benefitText}>• Audio guidance & music</Text>
          <Text style={styles.benefitText}>• Track your growth</Text>
          <Text style={styles.benefitText}>• Emergency spiritual support</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip Setup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
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
    fontSize: typography.sizes.lg,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: "#FFFFFF",
    fontSize: typography.sizes.xl,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: typography.sizes.sm,
    textAlign: "center",
    fontWeight: "500",
  },
  benefitsContainer: {
    alignItems: "flex-start",
    marginBottom: 48,
  },
  benefitText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: typography.sizes.md,
    marginBottom: 8,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    width: "100%",
  },
  continueButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    width: "100%",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.lg,
    fontWeight: "600",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: typography.sizes.md,
    fontWeight: "500",
  },
});
