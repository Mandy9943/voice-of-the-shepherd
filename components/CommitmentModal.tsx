import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { useSettingsStore } from "@/store/settingsStore";
import { Check, PenTool, X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CommitmentModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CommitmentModal({
  visible,
  onClose,
}: CommitmentModalProps) {
  const { isDarkMode, personalInfo, userProfile } = useSettingsStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const displayName = userProfile.name || personalInfo.name || "Friend";
  const signatureDate = userProfile.signatureDate || personalInfo.signatureDate;
  const spiritualGoals =
    userProfile.spiritualGoals.length > 0
      ? userProfile.spiritualGoals
      : personalInfo.spiritualGoals;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${theme.primary}15` },
              ]}
            >
              <PenTool size={24} color={theme.primary} />
            </View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Your Spiritual Contract
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.contractContainer,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.contractTitle, { color: theme.text }]}>
              {displayName}, your commitment:
            </Text>

            <Text style={[styles.contractSubtitle, { color: theme.text }]}>
              From this day, I commit to:
            </Text>

            <View style={styles.commitmentsList}>
              <View style={styles.commitmentItem}>
                <Check size={16} color="#10B981" />
                <Text
                  style={[styles.commitmentText, { color: theme.secondary }]}
                >
                  Growing closer to God daily
                </Text>
              </View>

              <View style={styles.commitmentItem}>
                <Check size={16} color="#10B981" />
                <Text
                  style={[styles.commitmentText, { color: theme.secondary }]}
                >
                  Listening to spiritual teachings
                </Text>
              </View>

              <View style={styles.commitmentItem}>
                <Check size={16} color="#10B981" />
                <Text
                  style={[styles.commitmentText, { color: theme.secondary }]}
                >
                  Building consistent spiritual habits
                </Text>
              </View>

              <View style={styles.commitmentItem}>
                <Check size={16} color="#10B981" />
                <Text
                  style={[styles.commitmentText, { color: theme.secondary }]}
                >
                  Seeking divine guidance and forgiveness
                </Text>
              </View>
            </View>

            {spiritualGoals.length > 0 && (
              <>
                <Text
                  style={[styles.personalGoalsTitle, { color: theme.text }]}
                >
                  Your personal spiritual goals:
                </Text>
                <View style={styles.personalGoalsList}>
                  {spiritualGoals.map((goal, index) => (
                    <View key={index} style={styles.commitmentItem}>
                      <Check size={16} color="#10B981" />
                      <Text
                        style={[
                          styles.commitmentText,
                          { color: theme.secondary },
                        ]}
                      >
                        {goal}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <Text style={[styles.trustText, { color: theme.text }]}>
              And I trust Voice of the Shepherd to guide me along the way and
              help me accomplish my spiritual resolutions.
            </Text>

            {signatureDate && (
              <View style={styles.signatureInfo}>
                <Text
                  style={[styles.signatureText, { color: theme.secondary }]}
                >
                  ✍️ Digitally signed on{" "}
                  {new Date(signatureDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            )}
          </View>

          <View
            style={[
              styles.reminderContainer,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.reminderTitle, { color: theme.text }]}>
              Daily Reminder
            </Text>
            <Text style={[styles.reminderText, { color: theme.secondary }]}>
              &quot;Commit to the Lord whatever you do, and he will establish
              your plans.&quot;
            </Text>
            <Text
              style={[styles.reminderReference, { color: theme.secondary }]}
            >
              - Proverbs 16:3
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.closeFooterButton,
              { backgroundColor: theme.primary },
            ]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeFooterButtonText}>Continue Journey</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contractContainer: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  contractTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  contractSubtitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 16,
  },
  commitmentsList: {
    marginBottom: 20,
  },
  commitmentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  commitmentText: {
    fontSize: typography.sizes.md,
    marginLeft: 12,
    flex: 1,
    lineHeight: typography.sizes.md * 1.3,
  },
  personalGoalsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  personalGoalsList: {
    marginBottom: 20,
  },
  trustText: {
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.4,
    marginBottom: 20,
  },
  signatureInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
  },
  signatureText: {
    fontSize: typography.sizes.sm,
    fontStyle: "italic",
    textAlign: "center",
  },
  reminderContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: "center",
  },
  reminderTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 12,
  },
  reminderText: {
    fontSize: typography.sizes.md,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: typography.sizes.md * 1.4,
    marginBottom: 8,
  },
  reminderReference: {
    fontSize: typography.sizes.sm,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  closeFooterButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  closeFooterButtonText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.md,
    fontWeight: "600",
  },
});
