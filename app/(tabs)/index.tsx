import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import {
  getProcessedCommands,
  getRandomCommand,
  JesusCommand,
} from "@/lib/commandsData";

import { CongratulationsModal } from "@/components/CongratulationsModal";
import { QuoteCard } from "@/components/QuoteCard";
import RescueMode from "@/components/RescueMode";
import { StreakProgress } from "@/components/StreakProgress";
import { usePlayerStore } from "@/store/playerStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useRouter } from "expo-router";
import {
  BookmarkIcon,
  Heart,
  Play,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, personalInfo } = useSettingsStore();
  const {
    streakData,
    dailyGoal,
    history,
    addToHistory,
    playQuote,
    resetDailyProgressIfNeeded,
  } = usePlayerStore();
  const insets = useSafeAreaInsets();

  const theme = isDarkMode ? colors.dark : colors.light;

  const [showRescueMode, setShowRescueMode] = useState(false);

  const handleSOSPress = () => {
    // setShowRescueMode(true);
  };

  // Get processed commands with local assets
  const quotes = getProcessedCommands();

  // Reset daily progress if needed when component mounts
  useEffect(() => {
    resetDailyProgressIfNeeded();
  }, []);

  // Get a random quote for the daily feature
  const dailyQuote = getRandomCommand();

  // Get recent quotes from history
  const recentQuotes = history
    .slice(0, 5)
    .map((id) => quotes.find((q: JesusCommand) => q.id === id))
    .filter(Boolean);

  const handleQuotePress = (id: string) => {
    addToHistory(id);
    router.push(`/quote/${id}`);
  };

  const handlePlayAll = () => {
    // Start playing from the first quote with all quotes as playlist
    playQuote(quotes[0], quotes);
    router.push(`/quote/${quotes[0].id}`);
  };

  const handlePlayDaily = () => {
    // Play the daily quote
    playQuote(dailyQuote, quotes);
    router.push(`/quote/${dailyQuote.id}`);
  };

  // Calculate progress
  const todayProgress = streakData.todayProgress.quotesListened;
  const progressPercentage = Math.min((todayProgress / dailyGoal) * 100, 100);

  // Get today's featured quotes
  const featuredQuotes = quotes.slice(0, 3);

  const greeting = () => {
    const hour = new Date().getHours();
    const name = personalInfo.name;

    if (hour < 12) {
      return `Good morning${name ? `, ${name}` : ""}`;
    } else if (hour < 17) {
      return `Good afternoon${name ? `, ${name}` : ""}`;
    } else {
      return `Good evening${name ? `, ${name}` : ""}`;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              {greeting()}
            </Text>
            <Text style={[styles.subtitle, { color: theme.secondary }]}>
              Continue your spiritual journey
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.sosButton, { backgroundColor: theme.rescue.danger }]}
            onPress={handleSOSPress}
            activeOpacity={0.8}
          >
            <Shield size={20} color="#FFFFFF" />
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Progress Section */}
        <View style={styles.section}>
          <StreakProgress />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Actions
          </Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => router.push("/categories")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: `${theme.primary}15` },
                ]}
              >
                <Play size={24} color={theme.primary} />
              </View>
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                Browse
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.secondary }]}>
                Categories
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => router.push("/favorites")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: `${theme.accent}15` },
                ]}
              >
                <BookmarkIcon size={24} color={theme.accent} />
              </View>
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                Saved
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.secondary }]}>
                Favorites
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Teachings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Today&apos;s Featured
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/categories")}
              activeOpacity={0.7}
            >
              <Text style={[styles.seeAllText, { color: theme.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {featuredQuotes.map((quote: JesusCommand) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onPress={() => router.push(`/quote/${quote.id}`)}
            />
          ))}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Your Journey
          </Text>

          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <TrendingUp size={24} color={theme.primary} />
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {streakData.currentStreak}
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondary }]}>
                Day Streak
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Target size={24} color={theme.accent} />
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {streakData.totalDaysCompleted}
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondary }]}>
                Days Completed
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Heart size={24} color={theme.rescue.success} />
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {Math.round(progressPercentage)}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondary }]}>
                Today&apos;s Goal
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <RescueMode
        visible={showRescueMode}
        onClose={() => setShowRescueMode(false)}
      />

      <CongratulationsModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: typography.sizes.xl,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.sizes.md,
  },
  sosButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sosButtonText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: typography.sizes.sm,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    textAlign: "center",
  },
});
