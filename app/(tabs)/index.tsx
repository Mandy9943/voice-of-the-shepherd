import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { getImageAsset } from "@/lib/imageAssets";
import { useSettingsStore } from "@/store/settingsStore";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Play } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { isDarkMode } = useSettingsStore();
  const insets = useSafeAreaInsets();

  const theme = isDarkMode ? colors.dark : colors.light;
  const handleQuotePress = (id: string) => {
    // addToHistory(id);
    // router.push(`/quote/${id}`);
  };

  const handlePlayDaily = () => {
    // Play the daily quote
    // playQuote(dailyQuote, quotes);
    // router.push(`/quote/${dailyQuote.id}`);
  };

  return (
    <>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingTop: insets.top },
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
              Voice of the Shepherd
            </Text>
            <Text style={[styles.subtitle, { color: theme.secondary }]}>
              Today&apos;s Word
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.dailyContainer}
          onPress={() => handleQuotePress("dailyQuote.id")}
          activeOpacity={0.9}
        >
          <Image
            source={getImageAsset("dailyQuote.id")}
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
            {/* <Text style={styles.dailyQuote}>{dailyQuote.text}</Text>
            <Text style={styles.dailyReference}>{dailyQuote.reference}</Text> */}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180, // Extra space for bigger mini player and tab bar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
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
  dailyContainer: {
    height: 240,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  footer: {
    height: 20,
  },
});
