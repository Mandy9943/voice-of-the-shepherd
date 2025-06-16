import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { getProcessedCommands } from "@/lib/commandsData";
import { usePlayerStore } from "@/store/playerStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Quote } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import {
  Heart,
  MessageCircle,
  Phone,
  Play,
  Shield,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RescueModeProps {
  visible: boolean;
  onClose: () => void;
}

const rescueQuotes = [
  {
    id: "1",
    text: "God is our refuge and strength, an ever-present help in trouble.",
    attribution: "Psalm 46:1",
    reference: "Psalm 46:1",
  },
  {
    id: "2",
    text: "The Lord is my light and my salvation; whom shall I fear? The Lord is the stronghold of my life; of whom shall I be afraid?",
    attribution: "Psalm 27:1",
    reference: "Psalm 27:1",
  },
];

export default function RescueMode({ visible, onClose }: RescueModeProps) {
  const { isDarkMode, rescueModeSettings } = useSettingsStore();
  const { playQuote } = usePlayerStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingCount, setBreathingCount] = useState(4);
  const [breathingPhase, setBreathingPhase] = useState<
    "inhale" | "hold" | "exhale" | "pause"
  >("inhale");

  // Get all quotes and filter them based on rescue categories
  const allQuotes = getProcessedCommands();
  const filteredQuotes = allQuotes.filter((quote: Quote) =>
    rescueModeSettings.rescueQuoteCategories.includes(quote.category)
  );

  // Use filtered quotes or fallback to all quotes if filter returns empty
  const quotesToUse = filteredQuotes.length > 0 ? filteredQuotes : allQuotes;
  const currentQuote =
    quotesToUse.length > 0 ? quotesToUse[currentQuoteIndex] : null;

  useEffect(() => {
    // Reset to the first quote when the modal is opened
    setCurrentQuoteIndex(0);

    if (visible && rescueModeSettings.autoPlayAudio && currentQuote) {
      playQuote(currentQuote, quotesToUse);
    }
  }, [visible, rescueModeSettings.autoPlayAudio]);

  useEffect(() => {
    // Autoplay when the quote changes
    if (visible && rescueModeSettings.autoPlayAudio && currentQuote) {
      playQuote(currentQuote, quotesToUse);
    }
  }, [currentQuote]);

  useEffect(() => {
    if (!showBreathing) return;

    const timer = setInterval(() => {
      setBreathingCount((prev) => {
        if (prev <= 1) {
          setBreathingPhase((current) => {
            switch (current) {
              case "inhale":
                return "hold";
              case "hold":
                return "exhale";
              case "exhale":
                return "pause";
              case "pause":
                return "inhale";
              default:
                return "inhale";
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showBreathing]);

  const handleNextQuote = () => {
    if (quotesToUse.length > 0) {
      const nextIndex = (currentQuoteIndex + 1) % quotesToUse.length;
      setCurrentQuoteIndex(nextIndex);
    }
  };

  const handlePlayAudio = () => {
    if (currentQuote) {
      playQuote(currentQuote, quotesToUse);
    }
  };

  const handleContactPress = (contact: string) => {
    // This will attempt to open the phone app with the contact number
    Linking.openURL(`tel:${contact}`).catch((err) =>
      console.error("Failed to open phone app:", err)
    );
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case "inhale":
        return "Breathe in slowly";
      case "hold":
        return "Hold your breath";
      case "exhale":
        return "Breathe out slowly";
      case "pause":
        return "Rest and pause";
      default:
        return "Breathe naturally";
    }
  };

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case "inhale":
        return "#10B981";
      case "hold":
        return "#F59E0B";
      case "exhale":
        return "#3B82F6";
      case "pause":
        return "#8B5CF6";
      default:
        return theme.primary;
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[
          theme.rescue?.background || theme.background,
          (theme.rescue?.primary || theme.primary) + "20",
        ]}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Shield size={24} color={theme.rescue?.primary || theme.primary} />
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Rescue Mode
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
          {/* Breathing Exercise */}
          {rescueModeSettings.showBreathingExercise && (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Breathing Exercise
              </Text>

              {!showBreathing ? (
                <TouchableOpacity
                  style={[
                    styles.breathingButton,
                    { backgroundColor: theme.rescue?.success || theme.primary },
                  ]}
                  onPress={() => setShowBreathing(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.breathingButtonText}>
                    Start Breathing Exercise
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.breathingContainer}>
                  <View
                    style={[
                      styles.breathingCircle,
                      {
                        backgroundColor: getBreathingColor(),
                        transform: [
                          {
                            scale:
                              breathingPhase === "inhale" ||
                              breathingPhase === "hold"
                                ? 1.2
                                : 0.8,
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.breathingCount}>{breathingCount}</Text>
                  </View>
                  <Text
                    style={[styles.breathingInstruction, { color: theme.text }]}
                  >
                    {getBreathingInstruction()}
                  </Text>
                  <TouchableOpacity
                    style={styles.stopBreathingButton}
                    onPress={() => setShowBreathing(false)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.stopBreathingText,
                        { color: theme.secondary },
                      ]}
                    >
                      Stop Exercise
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Spiritual Quote */}
          {currentQuote && (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Spiritual Guidance
              </Text>

              <View style={styles.quoteContainer}>
                <Text style={[styles.quoteText, { color: theme.text }]}>
                  &quot;{currentQuote.text}&quot;
                </Text>
                <Text
                  style={[styles.quoteAttribution, { color: theme.secondary }]}
                >
                  - {currentQuote.attribution}
                </Text>
                <Text
                  style={[styles.quoteReference, { color: theme.secondary }]}
                >
                  {currentQuote.reference}
                </Text>
              </View>

              <View style={styles.quoteActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.rescue?.primary || theme.primary },
                  ]}
                  onPress={handlePlayAudio}
                  activeOpacity={0.8}
                >
                  <Play size={16} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Listen</Text>
                </TouchableOpacity>

                {quotesToUse.length > 1 && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor:
                          theme.rescue?.secondary || theme.secondary,
                      },
                    ]}
                    onPress={handleNextQuote}
                    activeOpacity={0.8}
                  >
                    <Heart size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Next Quote</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Emergency Contacts */}
          {rescueModeSettings.emergencyContacts &&
            rescueModeSettings.emergencyContacts.length > 0 && (
              <View style={[styles.section, { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Emergency Contacts
                </Text>

                {rescueModeSettings.emergencyContacts.map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.contactButton,
                      { borderColor: theme.border },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleContactPress(contact)}
                  >
                    <Phone
                      size={16}
                      color={theme.rescue?.primary || theme.primary}
                    />
                    <Text style={[styles.contactText, { color: theme.text }]}>
                      {contact}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

          {/* Custom Prayers */}
          {rescueModeSettings.customPrayers &&
            rescueModeSettings.customPrayers.length > 0 && (
              <View style={[styles.section, { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Personal Prayers
                </Text>

                {rescueModeSettings.customPrayers.map((prayer, index) => (
                  <View
                    key={index}
                    style={[
                      styles.prayerContainer,
                      { borderColor: theme.border },
                    ]}
                  >
                    <MessageCircle
                      size={16}
                      color={theme.rescue?.primary || theme.primary}
                    />
                    <Text style={[styles.prayerText, { color: theme.text }]}>
                      {prayer}
                    </Text>
                  </View>
                ))}
              </View>
            )}

          {/* Encouragement */}
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.encouragementText, { color: theme.text }]}>
              &quot;God is our refuge and strength, an ever-present help in
              trouble.&quot;
            </Text>
            <Text
              style={[
                styles.encouragementReference,
                { color: theme.secondary },
              ]}
            >
              - Psalm 46:1
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

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
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: "700",
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 16,
  },
  breathingButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  breathingButtonText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.md,
    fontWeight: "600",
  },
  breathingContainer: {
    alignItems: "center",
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  breathingCount: {
    color: "#FFFFFF",
    fontSize: typography.sizes.xxxl,
    fontWeight: "700",
  },
  breathingInstruction: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    marginBottom: 16,
  },
  stopBreathingButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  stopBreathingText: {
    fontSize: typography.sizes.sm,
  },
  quoteContainer: {
    marginBottom: 20,
  },
  quoteText: {
    fontSize: typography.sizes.lg,
    lineHeight: typography.sizes.lg * 1.4,
    fontStyle: "italic",
    marginBottom: 12,
  },
  quoteAttribution: {
    fontSize: typography.sizes.md,
    fontWeight: "600",
    marginBottom: 4,
  },
  quoteReference: {
    fontSize: typography.sizes.sm,
  },
  quoteActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.sm,
    fontWeight: "600",
    marginLeft: 8,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  contactText: {
    fontSize: typography.sizes.md,
    marginLeft: 12,
  },
  prayerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  prayerText: {
    fontSize: typography.sizes.sm,
    marginLeft: 12,
    flex: 1,
    lineHeight: typography.sizes.sm * 1.4,
  },
  encouragementText: {
    fontSize: typography.sizes.lg,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: typography.sizes.lg * 1.4,
    marginBottom: 8,
  },
  encouragementReference: {
    fontSize: typography.sizes.md,
    textAlign: "center",
    fontWeight: "600",
  },
});
