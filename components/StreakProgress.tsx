import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { usePlayerStore } from "@/store/playerStore";
import { useSettingsStore } from "@/store/settingsStore";
import {
  Award,
  BookOpen,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StreakProgressProps {
  onPress?: () => void;
}

export const StreakProgress: React.FC<StreakProgressProps> = ({ onPress }) => {
  const { streakData } = usePlayerStore();
  const { isDarkMode } = useSettingsStore();

  const theme = isDarkMode ? colors.dark : colors.light;
  const dailyGoal = 10;

  const progressPercentage = Math.min(
    (streakData.todayProgress.quotesListened / dailyGoal) * 100,
    100
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Target size={20} color={theme.text} />
          <Text style={[styles.title, { color: theme.text }]}>
            Daily Spiritual Goal
          </Text>
        </View>
        <View style={styles.streakContainer}>
          <Flame size={16} color="#FF6B35" />
          <Text style={[styles.streakText, { color: theme.text }]}>
            {streakData.currentStreak} days
          </Text>
        </View>
      </View>

      <View style={styles.progressHeader}>
        <Text style={[styles.progressTitle, { color: theme.text }]}>
          Teachings Listened Today
        </Text>
        <Text style={[styles.progressCount, { color: theme.text }]}>
          {streakData.todayProgress.quotesListened} of {dailyGoal}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.primary,
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>
      </View>

      <Text style={[styles.progressSubtitle, { color: theme.secondary }]}>
        Begin your spiritual journey - listen to 10 teachings for divine
        forgiveness
      </Text>

      <View style={styles.statsRow}>
        <StatItem
          icon={<BookOpen size={20} color={theme.text} />}
          value={streakData.todayProgress.quotesListened}
          label="Listened Today"
          theme={theme}
        />
        <StatItem
          icon={<Flame size={20} color={theme.text} />}
          value={streakData.currentStreak}
          label="Days in a Row"
          theme={theme}
        />
        <StatItem
          icon={<Award size={20} color={theme.text} />}
          value={streakData.longestStreak}
          label="Best Streak"
          theme={theme}
        />
        <StatItem
          icon={<TrendingUp size={20} color={theme.text} />}
          value={streakData.totalQuotesListened}
          label="All Time Total"
          theme={theme}
        />
      </View>
    </View>
  );
};

const StatItem = ({
  icon,
  value,
  label,
  theme,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  theme: any;
}) => (
  <View style={styles.statItem}>
    <View style={styles.statValueContainer}>
      {icon}
      <Text style={[styles.statNumber, { color: theme.text, marginLeft: 4 }]}>
        {value}
      </Text>
    </View>
    <Text style={[styles.statLabel, { color: theme.secondary }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: "bold",
    marginLeft: 8,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: typography.sizes.sm,
    fontWeight: "bold",
    marginLeft: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: typography.sizes.md,
    fontWeight: "500",
  },
  progressCount: {
    fontSize: typography.sizes.md,
    fontWeight: "bold",
  },
  progressContainer: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
  },
  progressFill: {
    height: "100%",
  },
  progressSubtitle: {
    fontSize: typography.sizes.sm,
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.light.secondary,
  },
});
