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
import { getImageAsset } from "@/lib/imageAssets";
import { Image } from "expo-image";

import ConfessionTracker from "@/components/ConfessionTracker";
import { CongratulationsModal } from "@/components/CongratulationsModal";
import { QuoteCard } from "@/components/QuoteCard";
import RescueMode from "@/components/RescueMode";
import { StreakProgress } from "@/components/StreakProgress";
import { usePlayerStore } from "@/store/playerStore";
import { useSettingsStore } from "@/store/settingsStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Play, Shield, Shuffle } from "lucide-react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, personalInfo, rescueModeSettings } = useSettingsStore();
  const { addToHistory, playQuote } = usePlayerStore();
  const insets = useSafeAreaInsets();

  const theme = isDarkMode ? colors.dark : colors.light;

  const [showRescueMode, setShowRescueMode] = useState(false);

  const handleSOSPress = () => {
    setShowRescueMode(true);
  };

  // Get processed commands with local assets
  const quotes = getProcessedCommands();

  // Get a random quote for the daily feature
  const dailyQuote = getRandomCommand();

  const handleQuotePress = (id: string) => {
    addToHistory(id);
    router.push(`/quote/${id}`);
  };

  const handlePlayAll = () => {
    // Start playing from the first quote with all quotes as playlist
    playQuote(quotes[0], quotes, router);
  };

  const handlePlayDaily = () => {
    // Play the daily quote
    playQuote(dailyQuote, quotes, router);
  };

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

          {rescueModeSettings.enabled && (
            <TouchableOpacity
              style={[
                styles.sosButton,
                { backgroundColor: theme.rescue.danger },
              ]}
              onPress={handleSOSPress}
              activeOpacity={0.8}
            >
              <Shield size={20} color="#FFFFFF" />
              <Text style={styles.sosButtonText}>SOS</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Daily Quote */}
        <TouchableOpacity
          style={styles.dailyContainer}
          onPress={() => handleQuotePress(dailyQuote.id)}
          activeOpacity={0.9}
        >
          <Image
            source={getImageAsset(dailyQuote.id)}
            style={styles.dailyImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.gradient}
          />
          <View style={styles.dailyContent}>
            <View style={styles.dailyHeader}>
              <View style={styles.dailyBadge}>
                <Text style={styles.dailyBadgeText}>Daily Quote</Text>
              </View>
              <TouchableOpacity
                style={styles.dailyPlayButton}
                onPress={handlePlayDaily}
                activeOpacity={0.8}
              >
                <Play size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.dailyQuote}>{dailyQuote.text}</Text>
            <Text style={styles.dailyReference}>{dailyQuote.reference}</Text>
          </View>
        </TouchableOpacity>

        {/* Play All Teachings Button */}
        <TouchableOpacity
          style={[
            styles.playAllCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={handlePlayAll}
          activeOpacity={0.8}
        >
          <View
            style={[styles.playAllIconLeft, { backgroundColor: "#2E5BBA" }]}
          >
            <Shuffle size={24} color="#FFFFFF" />
          </View>
          <View style={styles.playAllContent}>
            <Text style={[styles.playAllTitle, { color: theme.text }]}>
              Play All Teachings
            </Text>
            <Text style={[styles.playAllSubtitle, { color: theme.secondary }]}>
              Listen to all {quotes.length} teachings in sequence
            </Text>
          </View>
          <View
            style={[styles.playAllIconRight, { backgroundColor: "#2E5BBA" }]}
          >
            <Play size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Progress Section */}
        <View style={styles.section}>
          <StreakProgress />
        </View>

        <View style={styles.section}>
          <ConfessionTracker />
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
  dailyContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  dailyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dailyBadge: {
    backgroundColor: "rgba(212, 175, 55, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dailyBadgeText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.xs,
    fontWeight: "600",
  },
  dailyPlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  dailyQuote: {
    color: "#FFFFFF",
    fontSize: typography.sizes.lg,
    fontFamily: typography.quoteFont,
    marginBottom: 8,
    lineHeight: typography.sizes.lg * 1.4,
  },
  dailyReference: {
    color: "rgba(255,255,255,0.8)",
    fontSize: typography.sizes.sm,
    fontStyle: "italic",
  },
  dailyImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
  dailyContainer: {
    height: 240,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  playAllCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  playAllIconLeft: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  playAllContent: {
    flex: 1,
  },
  playAllTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 4,
  },
  playAllSubtitle: {
    fontSize: typography.sizes.sm,
  },
  playAllIconRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});
