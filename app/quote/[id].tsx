import { AudioWaveform } from "@/components/AudioWaveform";
import { colors } from "@/constants/colors";
import { appStoreUrl, playStoreUrl } from "@/constants/links";
import { typography } from "@/constants/typography";
import { getProcessedCommands } from "@/lib/commandsData";
import { getImageAsset } from "@/lib/imageAssets";
import { usePlayerStore } from "@/store/playerStore";
import { useSettingsStore } from "@/store/settingsStore";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  List,
  Pause,
  Play,
  Share2,
  SkipBack,
  SkipForward,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Use processed commands with local assets
const quotes = getProcessedCommands();

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const {
    currentQuote,
    isPlaying,
    playlist,
    currentIndex,
    playQuote,
    pauseQuote,
    resumeQuote,
    nextQuote,
    previousQuote,
    toggleFavorite,
    addToHistory,
    favorites,
  } = usePlayerStore();
  const { isDarkMode } = useSettingsStore();

  const theme = isDarkMode ? colors.dark : colors.light;

  const localQuote = quotes.find((q) => q.id === id);
  const quote = currentQuote ?? localQuote;

  useEffect(() => {
    if (currentQuote && currentQuote.id !== id) {
      router.replace(`/quote/${currentQuote.id}`);
    }
  }, [currentQuote, id, router]);

  useEffect(() => {
    if (quote?.id) {
      addToHistory(quote.id);
    }
  }, [quote?.id, addToHistory]);

  if (!quote) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          Quote not found
        </Text>
      </View>
    );
  }

  const isCurrentQuote = currentQuote?.id === quote.id;
  const isCurrentlyPlaying = isCurrentQuote && isPlaying;
  const isFavorited = favorites.includes(quote.id);
  const showPlaylistControls = playlist.length > 1;

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      pauseQuote();
    } else if (isCurrentQuote) {
      resumeQuote();
    } else {
      playQuote(quote, quotes);
    }
  };

  const handleFavorite = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFavorite(quote.id);
  };

  const handleShare = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (!quote) return;

    try {
      const appUrl = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;

      const message = `Listen to this teaching from Jesus:\n\n"${quote.text}" — ${quote.reference}\n\nShared from the "My Shepherd" app. You can download it here: ${appUrl}`;

      await Share.share(
        {
          message,
          url: appUrl, // iOS
          title: `A teaching from ${quote.attribution}`, // Android
        },
        {
          dialogTitle: "Share this teaching", // Android
        }
      );
    } catch (error) {
      Alert.alert("Error", "Could not share the teaching at this time.");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleNext = () => {
    nextQuote();
  };

  const handlePrevious = () => {
    previousQuote();
  };

  const handlePlayAll = () => {
    // Start playing from this quote with all quotes as playlist
    playQuote(quote, quotes);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Image
        source={getImageAsset(quote.id)}
        style={styles.backgroundImage}
        contentFit="cover"
      />

      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      />

      {/* Custom Header with Back Button */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>

        {!isCurrentQuote && (
          <TouchableOpacity
            style={styles.playAllButton}
            onPress={handlePlayAll}
            activeOpacity={0.8}
          >
            <List size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.playAllText}>Play All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{quote.category}</Text>
        </View>

        <Text style={styles.quote}>{quote.text}</Text>

        <Text style={styles.attribution}>{quote.attribution}</Text>

        <Text style={styles.reference}>{quote.reference}</Text>

        <View style={styles.playerContainer}>
          <View style={styles.playerControls}>
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                isFavorited && styles.favoriteActive,
              ]}
              onPress={handleFavorite}
            >
              <Heart
                size={24}
                color="#FFFFFF"
                fill={isFavorited ? "#E25822" : "transparent"}
              />
            </TouchableOpacity>

            {showPlaylistControls && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handlePrevious}
              >
                <SkipBack size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
            >
              {isCurrentlyPlaying ? (
                <Pause size={32} color="#FFFFFF" />
              ) : (
                <Play size={32} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            {showPlaylistControls && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleNext}
              >
                <SkipForward size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Share2 size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {showPlaylistControls && (
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistText}>
                {currentIndex + 1} of {playlist.length}
              </Text>
            </View>
          )}

          {isCurrentlyPlaying && (
            <View style={styles.waveformContainer}>
              <AudioWaveform />
            </View>
          )}
        </View>

        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>Explanation</Text>
          <Text style={styles.explanation}>{quote.explanation}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    width,
    height,
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  customHeader: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playAllText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 120,
    paddingBottom: 40,
  },
  categoryContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  category: {
    color: "#FFFFFF",
    fontSize: typography.sizes.xs,
    fontWeight: "600",
  },
  quote: {
    color: "#FFFFFF",
    fontSize: typography.sizes.xxl,
    fontFamily: typography.quoteFont,
    marginBottom: 16,
    lineHeight: typography.sizes.xxl * 1.4,
  },
  attribution: {
    color: "#FFFFFF",
    fontSize: typography.sizes.md,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  reference: {
    color: "rgba(255,255,255,0.8)",
    fontSize: typography.sizes.md,
    fontStyle: "italic",
    marginBottom: 40,
  },
  playerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  playerControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
  },
  favoriteActive: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  shareButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
  },
  playlistInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
  playlistText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: typography.sizes.sm,
  },
  waveformContainer: {
    marginTop: 20,
  },
  explanationContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 20,
  },
  explanationTitle: {
    color: "#FFFFFF",
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 12,
  },
  explanation: {
    color: "#FFFFFF",
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.6,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    textAlign: "center",
    marginTop: 100,
  },
});
