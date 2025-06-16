import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Bell, BellOff, ArrowRight, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationService } from '@/services/notificationService';

export default function NotificationsScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDailyNotifications } = useSettingsStore();
  const insets = useSafeAreaInsets();
  const theme = isDarkMode ? colors.dark : colors.light;
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    router.push('/onboarding/goals');
  };

  const handleEnableNotifications = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Not Available',
        'Notifications are not supported on web browsers.',
        [{ text: 'Continue', onPress: handleContinue }]
      );
      return;
    }

    setIsLoading(true);
    
    try {
      const hasPermission = await NotificationService.requestPermissions();
      if (hasPermission) {
        await toggleDailyNotifications();
        handleContinue();
      } else {
        Alert.alert(
          'Permission Denied',
          'You can enable notifications later in Settings.',
          [{ text: 'Continue', onPress: handleContinue }]
        );
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
      Alert.alert(
        'Error',
        'There was an issue setting up notifications.',
        [{ text: 'Continue', onPress: handleContinue }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
            <Bell size={48} color={theme.primary} />
          </View>
          
          <Text style={[styles.title, { color: theme.text }]}>Stay on track</Text>
          <Text style={[styles.subtitle, { color: theme.secondary }]}>
            Get gentle reminders for your daily practice
          </Text>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={[styles.benefitText, { color: theme.secondary }]}>
            • Build consistent habits
          </Text>
          <Text style={[styles.benefitText, { color: theme.secondary }]}>
            • Never miss your reflection time
          </Text>
          <Text style={[styles.benefitText, { color: theme.secondary }]}>
            • Stay motivated on your journey
          </Text>
        </View>

        <View style={[styles.timesContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.timesTitle, { color: theme.text }]}>
            Default reminder times:
          </Text>
          
          <View style={styles.timeItem}>
            <Clock size={16} color={theme.secondary} />
            <Text style={[styles.timeText, { color: theme.secondary }]}>
              8:00 AM - Morning Reflection
            </Text>
          </View>
          
          <View style={styles.timeItem}>
            <Clock size={16} color={theme.secondary} />
            <Text style={[styles.timeText, { color: theme.secondary }]}>
              12:00 PM - Midday Wisdom
            </Text>
          </View>
          
          <View style={styles.timeItem}>
            <Clock size={16} color={theme.secondary} />
            <Text style={[styles.timeText, { color: theme.secondary }]}>
              8:00 PM - Evening Peace
            </Text>
          </View>
          
          <Text style={[styles.customizeNote, { color: theme.secondary }]}>
            Customize these in Settings later
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View style={[styles.dot, styles.activeDot, { backgroundColor: theme.primary }]} />
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleContinue}
          activeOpacity={0.7}
        >
          <BellOff size={20} color={theme.secondary} style={styles.skipIcon} />
          <Text style={[styles.skipButtonText, { color: theme.secondary }]}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.enableButton, { backgroundColor: theme.primary }]}
          onPress={handleEnableNotifications}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.enableButtonText}>
            {isLoading ? 'Setting up...' : 'Enable Reminders'}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.quoteFont,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    lineHeight: typography.sizes.md * 1.4,
  },
  benefitsContainer: {
    marginBottom: 32,
    paddingLeft: 8,
  },
  benefitText: {
    fontSize: typography.sizes.md,
    marginBottom: 8,
    fontWeight: '500',
  },
  timesContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  timesTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: typography.sizes.sm,
    marginLeft: 8,
  },
  customizeNote: {
    fontSize: typography.sizes.xs,
    marginTop: 12,
    fontStyle: 'italic',
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipIcon: {
    marginRight: 8,
  },
  skipButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: '500',
  },
  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  arrowIcon: {
    marginLeft: 8,
  },
});