import CommitmentModal from "@/components/CommitmentModal";
import { NotificationTimeManager } from "@/components/NotificationTimeManager";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { roadmapItems } from "@/lib/appData";
import { NotificationService } from "@/services/notificationService";
import { usePlayerStore } from "@/store/playerStore";
import { useSettingsStore } from "@/store/settingsStore";
import {
  Bell,
  Edit3,
  FileText,
  Heart,
  LogOut,
  Mail,
  Moon,
  Music,
  Shield,
  Sun,
  Target,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const appVersion = "1.0.0";
const appName = "My Shepherd";

export default function SettingsScreen() {
  const {
    isDarkMode,
    enableBackgroundMusic,
    dailyNotifications,
    notificationTimes,
    rescueModeSettings,
    personalInfo,
    userProfile,
    toggleDarkMode,
    toggleBackgroundMusic,
    toggleDailyNotifications,
    toggleRescueMode,

    signOutUser,
    updateUserProfile,
  } = useSettingsStore();

  const { dailyGoal, setDailyGoal } = usePlayerStore();
  const insets = useSafeAreaInsets();
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);

  const theme = isDarkMode ? colors.dark : colors.light;

  const handleNotificationToggle = async () => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Not Available",
        "Notifications are not supported on web browsers.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!dailyNotifications) {
      // About to enable notifications
      const hasPermission = await NotificationService.requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to receive daily quotes.",
          [{ text: "OK" }]
        );
        return;
      }
    }

    await toggleDailyNotifications();
  };

  // const handleResetApp = () => {
  //   Alert.alert(
  //     "Reset Application",
  //     "This will delete all your data, including progress, settings, and favorites. This action cannot be undone. Are you sure you want to proceed?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Reset App",
  //         style: "destructive",
  //         onPress: () => {
  //           try {
  //             // Clear all persisted storage for each store
  //             useSettingsStore.persist.clearStorage();
  //             usePlayerStore.persist.clearStorage();
  //             useConfessionStore.persist.clearStorage();

  //             // Give storage clearing a moment before reloading
  //             setTimeout(() => {
  //               // Reload the application to apply changes
  //               DevSettings.reload();
  //             }, 500);
  //           } catch (error) {
  //             console.error("Failed to reset the app:", error);
  //             Alert.alert(
  //               "Error",
  //               "An error occurred while resetting the app. Please try again."
  //             );
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

  const handleDailyGoalChange = () => {
    Alert.alert("Change Daily Goal", "Select your new daily teaching goal:", [
      { text: "Cancel", style: "cancel" },
      { text: "5 teachings", onPress: () => setDailyGoal(5) },
      { text: "10 teachings", onPress: () => setDailyGoal(10) },
      { text: "15 teachings", onPress: () => setDailyGoal(15) },
      { text: "20 teachings", onPress: () => setDailyGoal(20) },
    ]);
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out? Your spiritual progress will be saved locally.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            signOutUser();
            Alert.alert("Signed Out", "You have been signed out successfully.");
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "What would you like to update?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update Age",
        onPress: () => {
          Alert.prompt(
            "Update Age",
            "Enter your age:",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Update",
                onPress: (age) => {
                  if (age && !isNaN(parseInt(age))) {
                    updateUserProfile({ age: parseInt(age) });
                    Alert.alert("Success", "Age updated successfully!");
                  }
                },
              },
            ],
            "plain-text",
            userProfile.age?.toString() || ""
          );
        },
      },
      {
        text: "View Contract",
        onPress: () => setShowCommitmentModal(true),
      },
    ]);
  };

  const handleSendFeedback = () => {
    // NOTE: Please replace this with your actual support email address
    const to = "bucur.andrei.teodor@gmail.com";
    const subject = `App Feedback (${appName} v${appVersion})`;
    const body = `

---
App Version: ${appVersion}
Device OS: ${Platform.OS}

`;

    const url = `mailto:${to}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Error",
        `Could not open email client. Please send feedback to ${to}`
      );
    });
  };

  const enabledNotificationTimes = notificationTimes.filter((t) => t.enabled);
  const displayName = userProfile.name || personalInfo.name;
  const displayAge = userProfile.age || personalInfo.age;
  const hasCommitments =
    userProfile.spiritualGoals.length > 0 ||
    personalInfo.spiritualGoals.length > 0 ||
    userProfile.hasSignedContract ||
    personalInfo.hasSignedContract;

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.secondary }]}>
          Customize your spiritual journey
        </Text>
      </View>
      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Profile
        </Text>

        {userProfile.isSignedIn ? (
          <View style={styles.profileContainer}>
            <View style={styles.profileHeader}>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.text }]}>
                  {displayName || "User"}
                </Text>
                {userProfile.email && (
                  <Text
                    style={[styles.profileEmail, { color: theme.secondary }]}
                  >
                    {userProfile.email}
                  </Text>
                )}
                {displayAge && (
                  <Text style={[styles.profileAge, { color: theme.secondary }]}>
                    Age: {displayAge}
                  </Text>
                )}
                <View style={styles.providerBadge}>
                  <Text style={styles.providerText}>
                    {userProfile.signInProvider === "google"
                      ? "🔍 Google"
                      : "🍎 Apple"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <Edit3 size={16} color={theme.secondary} />
              </TouchableOpacity>
            </View>

            {/* Spiritual Commitments */}
            {hasCommitments && (
              <TouchableOpacity
                style={[
                  styles.commitmentsContainer,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
                onPress={() => setShowCommitmentModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.commitmentsHeader}>
                  <FileText size={20} color={theme.primary} />
                  <Text
                    style={[styles.commitmentsTitle, { color: theme.text }]}
                  >
                    Your Spiritual Contract
                  </Text>
                </View>

                <Text
                  style={[
                    styles.commitmentsSubtitle,
                    { color: theme.secondary },
                  ]}
                >
                  Tap to view your commitments and signature
                </Text>

                {(userProfile.signatureDate || personalInfo.signatureDate) && (
                  <Text
                    style={[styles.signatureDate, { color: theme.secondary }]}
                  >
                    ✍️ Signed on{" "}
                    {new Date(
                      userProfile.signatureDate || personalInfo.signatureDate!
                    ).toLocaleDateString()}
                  </Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <LogOut size={16} color={theme.secondary} />
              <Text style={[styles.signOutText, { color: theme.secondary }]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.signInContainer}>
            {displayName && (
              <View style={styles.localProfileInfo}>
                <Text style={[styles.localProfileName, { color: theme.text }]}>
                  Welcome, {displayName}!
                </Text>
                {displayAge && (
                  <Text
                    style={[styles.localProfileAge, { color: theme.secondary }]}
                  >
                    Age: {displayAge}
                  </Text>
                )}
                {hasCommitments && (
                  <TouchableOpacity
                    style={styles.viewContractButton}
                    onPress={() => setShowCommitmentModal(true)}
                    activeOpacity={0.7}
                  >
                    <FileText size={16} color={theme.primary} />
                    <Text
                      style={[
                        styles.viewContractText,
                        { color: theme.primary },
                      ]}
                    >
                      View Your Contract
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Spiritual Goals
        </Text>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={handleDailyGoalChange}
          activeOpacity={0.7}
        >
          <View style={styles.settingLabelContainer}>
            <Target size={22} color={theme.text} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Daily Teaching Goal
              </Text>
              <Text style={[styles.settingSubtext, { color: theme.secondary }]}>
                Currently set to {dailyGoal} teachings per day
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Emergency Support
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Shield size={22} color={theme.text} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Rescue Mode
              </Text>
              <Text style={[styles.settingSubtext, { color: theme.secondary }]}>
                Emergency spiritual support when facing temptation
              </Text>
            </View>
          </View>
          <Switch
            value={rescueModeSettings.enabled}
            onValueChange={toggleRescueMode}
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Appearance
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            {isDarkMode ? (
              <Moon size={22} color={theme.text} style={styles.settingIcon} />
            ) : (
              <Sun size={22} color={theme.text} style={styles.settingIcon} />
            )}
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Audio</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Music size={22} color={theme.text} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Background Music
            </Text>
          </View>
          <Switch
            value={enableBackgroundMusic}
            onValueChange={toggleBackgroundMusic}
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Notifications
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Bell size={22} color={theme.text} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Daily Notifications
              </Text>
              {Platform.OS !== "web" && dailyNotifications && (
                <Text
                  style={[styles.settingSubtext, { color: theme.secondary }]}
                >
                  {enabledNotificationTimes.length} custom times scheduled
                </Text>
              )}
              {Platform.OS === "web" && (
                <Text
                  style={[styles.settingSubtext, { color: theme.secondary }]}
                >
                  Not available on web
                </Text>
              )}
            </View>
          </View>
          <Switch
            value={dailyNotifications && Platform.OS !== "web"}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor="#FFFFFF"
            disabled={Platform.OS === "web"}
          />
        </View>

        {Platform.OS !== "web" && dailyNotifications && (
          <NotificationTimeManager isDarkMode={isDarkMode} />
        )}
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Feedback & Support
        </Text>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={handleSendFeedback}
          activeOpacity={0.7}
        >
          <View style={styles.settingLabelContainer}>
            <Mail size={22} color={theme.text} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Send Feedback
              </Text>
              <Text style={[styles.settingSubtext, { color: theme.secondary }]}>
                Have a suggestion or an issue? Let us know!
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      {/* <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.error }]}>
          Danger Zone
        </Text>
        <Text
          style={[
            styles.settingSubtext,
            { color: theme.secondary, marginBottom: 12 },
          ]}
        >
          This will delete all your data, including progress, settings, and
          favorites. This action cannot be undone.
        </Text>
        <TouchableOpacity
          style={[styles.dangerButton, { backgroundColor: theme.error }]}
          onPress={handleResetApp}
          activeOpacity={0.8}
        >
          <AlertTriangle size={18} color="#FFFFFF" />
          <Text style={styles.dangerButtonText}>Reset Application</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.section}>
        <View
          style={[styles.supportButton, { backgroundColor: theme.primary }]}
        >
          <View style={styles.supportContent}>
            <View style={styles.supportIconContainer}>
              <View
                style={[
                  styles.heartIconWrapper,
                  { backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
              >
                <Heart size={40} color="#FF0000" fill="#FF0000" />
              </View>
            </View>

            <View style={styles.supportTextContainer}>
              <Text style={styles.roadmapTitle}>Roadmap:</Text>

              <View style={styles.supportFeatures}>
                {roadmapItems.map((item, index) => (
                  <Text key={index} style={styles.supportFeature}>
                    {item}
                  </Text>
                ))}
              </View>

              <Text style={styles.stripeText}>Secure payment by Stripe</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={[styles.version, { color: theme.secondary }]}>
        Version 1.0.0
      </Text>

      <View style={styles.footer} />

      {/* Commitment Modal */}
      <CommitmentModal
        visible={showCommitmentModal}
        onClose={() => setShowCommitmentModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 180, // Extra space for bigger mini player and tab bar
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.quoteFont,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    marginBottom: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: typography.sizes.md,
  },
  settingSubtext: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },

  // Profile Section Styles
  profileContainer: {
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: typography.sizes.sm,
    marginBottom: 2,
  },
  profileAge: {
    fontSize: typography.sizes.sm,
    marginBottom: 4,
  },
  providerBadge: {
    alignSelf: "flex-start",
  },
  providerText: {
    fontSize: typography.sizes.xs,
    color: "#666",
  },
  editButton: {
    padding: 8,
  },
  commitmentsContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  commitmentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commitmentsTitle: {
    fontSize: typography.sizes.md,
    fontWeight: "600",
    marginLeft: 8,
  },
  commitmentsSubtitle: {
    fontSize: typography.sizes.sm,
    marginBottom: 8,
  },
  signatureDate: {
    fontSize: typography.sizes.xs,
    fontStyle: "italic",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  signOutText: {
    fontSize: typography.sizes.sm,
    marginLeft: 6,
  },

  // Local Profile (not signed in) Styles
  localProfileInfo: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  localProfileName: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 4,
  },
  localProfileAge: {
    fontSize: typography.sizes.sm,
    marginBottom: 8,
  },
  viewContractButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  viewContractText: {
    fontSize: typography.sizes.sm,
    marginLeft: 6,
    fontWeight: "500",
  },

  // Sign In Section Styles
  signInContainer: {
    marginBottom: 8,
  },
  signInDescription: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * 1.4,
    marginBottom: 16,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  providerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  signInButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: "500",
    flex: 1,
  },

  supportButton: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
  },
  supportContent: {
    padding: 32,
  },
  supportIconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  heartIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  supportTextContainer: {
    alignItems: "center",
  },
  supportDescription: {
    color: "rgba(255,255,255,0.95)",
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.6,
    marginBottom: 24,
    textAlign: "center",
  },
  roadmapTitle: {
    color: "#FFFFFF",
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  supportFeatures: {
    alignSelf: "stretch",
    marginBottom: 24,
  },
  supportFeature: {
    color: "rgba(255,255,255,0.9)",
    fontSize: typography.sizes.sm,
    marginBottom: 8,
    fontWeight: "500",
    textAlign: "center",
  },
  donateButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  donateButtonText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.lg,
    fontWeight: "600",
  },
  stripeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: typography.sizes.sm,
    textAlign: "center",
  },
  version: {
    textAlign: "center",
    fontSize: typography.sizes.sm,
    marginTop: 16,
  },
  footer: {
    height: 20,
  },
  dangerButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerButtonText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.md,
    fontWeight: "600",
    marginLeft: 8,
  },
});
