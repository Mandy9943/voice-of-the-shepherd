import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { useConfessionStore } from "@/store/confessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import {
  Calendar as CalendarIcon,
  Check,
  Plus,
  Shield,
  Target,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";

const ConfessionTracker: React.FC = () => {
  const {
    lastConfessionDate,
    spiritualGoals,
    addSpiritualGoal,
    toggleGoalCompleted,
    updateLastConfessionDate,
    removeSpiritualGoal,
    getDaysSinceLastConfession,
  } = useConfessionStore();
  const { isDarkMode } = useSettingsStore();
  const [showModal, setShowModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const theme = isDarkMode ? colors.dark : colors.light;

  const daysSinceConfession = getDaysSinceLastConfession();

  const completedGoals = spiritualGoals.filter((goal) => goal.completed).length;
  const totalGoals = spiritualGoals.length;

  const commonSins = [
    {
      sin: "Pride",
      virtue: "Humility",
      description:
        "Practice putting others first and acknowledging God's grace",
    },
    {
      sin: "Anger",
      virtue: "Patience",
      description: "Respond with love and understanding instead of anger",
    },
    {
      sin: "Envy",
      virtue: "Gratitude",
      description: "Focus on your blessings and celebrate others' success",
    },
    {
      sin: "Laziness",
      virtue: "Diligence",
      description: "Be faithful in small things and serve others actively",
    },
    {
      sin: "Greed",
      virtue: "Generosity",
      description: "Share your resources and trust in God's provision",
    },
    {
      sin: "Gossip",
      virtue: "Kindness",
      description: "Speak words that build up and encourage others",
    },
    {
      sin: "Impatience",
      virtue: "Peace",
      description: "Trust in God's timing and remain calm in trials",
    },
    {
      sin: "Selfishness",
      virtue: "Love",
      description: "Seek to serve others as Christ served us",
    },
  ];

  const handleUpdateConfession = () => {
    updateLastConfessionDate(new Date(selectedDate));
    setShowModal(false);
    Alert.alert(
      "Confession Updated",
      "May God's peace be with you. Your spiritual journey continues.",
      [{ text: "Amen", style: "default" }]
    );
  };

  const handleAddGoal = (sinData?: {
    sin: string;
    virtue: string;
    description: string;
  }) => {
    if (sinData) {
      addSpiritualGoal(sinData.sin, sinData.virtue, sinData.description);
    } else if (newGoal.trim()) {
      addSpiritualGoal(newGoal.trim(), "", "");
      setNewGoal("");
    }
    setShowGoalModal(false);
  };

  const getConfessionMessage = () => {
    if (daysSinceConfession === null) {
      return "Begin your journey of reconciliation with God";
    } else if (daysSinceConfession === 0) {
      return "Blessed are those who seek forgiveness - you confessed today";
    } else if (daysSinceConfession <= 7) {
      return `${daysSinceConfession} days since confession - walking in grace`;
    } else if (daysSinceConfession <= 30) {
      return `${daysSinceConfession} days since confession - consider returning to the sacrament`;
    } else {
      return `${daysSinceConfession} days since confession - God awaits your return with open arms`;
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.accent + "20" },
              ]}
            >
              <Shield size={20} color={theme.accent} />
            </View>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>
                Confession & Growth
              </Text>
              <Text style={[styles.subtitle, { color: theme.secondary }]}>
                Track your spiritual journey
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.daysContainer,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <CalendarIcon size={16} color={theme.primary} />
            {daysSinceConfession && (
              <Text style={[styles.daysText, { color: theme.text }]}>
                {daysSinceConfession}
              </Text>
            )}
          </View>
        </View>

        <Text style={[styles.confessionMessage, { color: theme.secondary }]}>
          {getConfessionMessage()}
        </Text>

        {totalGoals > 0 && (
          <View style={styles.goalsSection}>
            <View style={styles.goalsHeader}>
              <Text style={[styles.goalsTitle, { color: theme.text }]}>
                Spiritual Goals
              </Text>
              <Text style={[styles.goalsProgress, { color: theme.primary }]}>
                {completedGoals}/{totalGoals}
              </Text>
            </View>

            <View
              style={[styles.progressBar, { backgroundColor: theme.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.success,
                    width:
                      totalGoals > 0
                        ? `${(completedGoals / totalGoals) * 100}%`
                        : "0%",
                  },
                ]}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Main Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: theme.border }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Confession & Spiritual Growth
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Confession Section */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Shield size={24} color={theme.accent} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Last Confession
                </Text>
              </View>

              <Calendar
                current={selectedDate}
                onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: theme.primary,
                  },
                  ...(lastConfessionDate && {
                    [lastConfessionDate]: {
                      marked: true,
                      dotColor: theme.accent,
                    },
                  }),
                }}
                theme={{
                  backgroundColor: theme.card,
                  calendarBackground: theme.card,
                  textSectionTitleColor: theme.secondary,
                  selectedDayBackgroundColor: theme.primary,
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: theme.primary,
                  dayTextColor: theme.text,
                  textDisabledColor: theme.muted,
                  arrowColor: theme.primary,
                  monthTextColor: theme.text,
                  indicatorColor: theme.primary,
                  textDayFontWeight: "300",
                  textMonthFontWeight: "bold",
                  textDayHeaderFontWeight: "300",
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 16,
                }}
              />

              <TouchableOpacity
                style={[styles.updateButton, { backgroundColor: theme.accent }]}
                onPress={handleUpdateConfession}
              >
                <CalendarIcon size={20} color="#FFFFFF" />
                <Text style={styles.updateButtonText}>
                  Update Confession Date
                </Text>
              </TouchableOpacity>
            </View>

            {/* Spiritual Goals Section */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Target size={24} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Spiritual Goals
                </Text>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: theme.primary }]}
                  onPress={() => setShowGoalModal(true)}
                >
                  <Plus size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {spiritualGoals.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.secondary }]}>
                  No spiritual goals yet. Add some to track your growth in
                  virtue.
                </Text>
              ) : (
                spiritualGoals.map((goal) => (
                  <View
                    key={goal.id}
                    style={[
                      styles.goalItem,
                      {
                        borderColor: theme.border,
                        opacity: goal.completed ? 0.6 : 1,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.goalCheckbox,
                        {
                          backgroundColor: goal.completed
                            ? theme.success
                            : "transparent",
                          borderColor: goal.completed
                            ? theme.success
                            : theme.border,
                        },
                      ]}
                      onPress={() => toggleGoalCompleted(goal.id)}
                    >
                      {goal.completed && <Check size={16} color="#FFFFFF" />}
                    </TouchableOpacity>

                    <View style={styles.goalTextContainer}>
                      <Text
                        style={[
                          styles.goalText,
                          {
                            color: goal.completed
                              ? theme.secondary
                              : theme.text,
                            textDecorationLine: goal.completed
                              ? "line-through"
                              : "none",
                          },
                        ]}
                      >
                        Overcome {goal.sin} with {goal.virtue}
                      </Text>
                      {goal.description ? (
                        <Text
                          style={[
                            styles.goalDescription,
                            { color: theme.secondary },
                          ]}
                        >
                          {goal.description}
                        </Text>
                      ) : null}
                    </View>

                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeSpiritualGoal(goal.id)}
                    >
                      <X size={16} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Add Goal Modal */}
      <Modal
        visible={showGoalModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: theme.border }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Add Spiritual Goal
            </Text>
            <TouchableOpacity onPress={() => setShowGoalModal(false)}>
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Common Sins & Virtues */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.text, marginLeft: 0 },
                ]}
              >
                Common Areas for Growth
              </Text>
              <Text
                style={[styles.sectionSubtitle, { color: theme.secondary }]}
              >
                Choose a virtue to overcome a particular struggle
              </Text>

              {commonSins.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.sinItem, { borderColor: theme.border }]}
                  onPress={() => handleAddGoal(item)}
                >
                  <View style={styles.sinHeader}>
                    <Text style={[styles.sinText, { color: theme.error }]}>
                      {item.sin}
                    </Text>
                    <Text
                      style={[styles.arrowText, { color: theme.secondary }]}
                    >
                      →
                    </Text>
                    <Text style={[styles.virtueText, { color: theme.success }]}>
                      {item.virtue}
                    </Text>
                  </View>
                  <Text
                    style={[styles.sinDescription, { color: theme.secondary }]}
                  >
                    {item.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Goal */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.text, marginLeft: 0 },
                ]}
              >
                Custom Goal
              </Text>

              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Ex: Practice patience with my family"
                placeholderTextColor={theme.secondary}
                value={newGoal}
                onChangeText={setNewGoal}
              />

              <TouchableOpacity
                style={[
                  styles.addGoalButton,
                  {
                    backgroundColor: newGoal.trim()
                      ? theme.primary
                      : theme.muted,
                  },
                ]}
                onPress={() => handleAddGoal()}
                disabled={!newGoal.trim()}
              >
                <Plus
                  size={20}
                  color={newGoal.trim() ? "#FFFFFF" : theme.secondary}
                />
                <Text
                  style={[
                    styles.addGoalButtonText,
                    { color: newGoal.trim() ? "#FFFFFF" : theme.secondary },
                  ]}
                >
                  Add Custom Goal
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

type Style = {
  container: ViewStyle;
  header: ViewStyle;
  titleContainer: ViewStyle;
  iconContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  daysContainer: ViewStyle;
  daysText: TextStyle;
  confessionMessage: TextStyle;
  goalsSection: ViewStyle;
  goalsHeader: ViewStyle;
  goalsTitle: TextStyle;
  goalsProgress: TextStyle;
  progressBar: ViewStyle;
  progressFill: ViewStyle;
  modalContainer: ViewStyle;
  modalHeader: ViewStyle;
  modalTitle: TextStyle;
  modalContent: ViewStyle;
  section: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  sectionSubtitle: TextStyle;
  confessionDate: TextStyle;
  updateButton: ViewStyle;
  updateButtonText: TextStyle;
  addButton: ViewStyle;
  emptyText: TextStyle;
  goalItem: ViewStyle;
  goalCheckbox: ViewStyle;
  goalTextContainer: ViewStyle;
  goalText: TextStyle;
  goalDescription: TextStyle;
  removeButton: ViewStyle;
  sinItem: ViewStyle;
  sinHeader: ViewStyle;
  sinText: TextStyle;
  arrowText: TextStyle;
  virtueText: TextStyle;
  sinDescription: TextStyle;
  textInput: TextStyle;
  addGoalButton: ViewStyle;
  addGoalButtonText: TextStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
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
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
  },
  daysContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  daysText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginLeft: 6,
  },
  confessionMessage: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
    marginBottom: 16,
  },
  goalsSection: {
    marginTop: 8,
  },
  goalsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  goalsTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  goalsProgress: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginLeft: 12,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.sm,
    marginBottom: 16,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  confessionDate: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: 8,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginLeft: 8,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: typography.sizes.md,
    textAlign: "center",
    lineHeight: typography.sizes.md * typography.lineHeights.relaxed,
    paddingVertical: 16,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: typography.sizes.sm,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  sinItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  sinHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  sinText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  arrowText: {
    fontSize: typography.sizes.md,
    marginHorizontal: 8,
  },
  virtueText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  sinDescription: {
    fontSize: typography.sizes.sm,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: typography.sizes.md,
    textAlignVertical: "top",
    marginBottom: 12,
    minHeight: 80,
  },
  addGoalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  addGoalButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginLeft: 8,
  },
});

export default ConfessionTracker;
