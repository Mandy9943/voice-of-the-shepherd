import { NotificationTime } from "@/store/settingsStore";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "web") {
      console.log("Notifications not supported on web");
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Daily Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === "granted";
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  static async scheduleCustomNotifications(
    notificationTimes: NotificationTime[]
  ): Promise<void> {
    if (Platform.OS === "web") {
      console.log("Notifications not supported on web");
      return;
    }

    try {
      // Cancel existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log("Notification permissions not granted");
        return;
      }

      // Schedule notifications for each enabled time
      for (const time of notificationTimes) {
        if (time.enabled) {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: `${time.label} ${this.getTimeEmoji(time.hour)}`,
              body: this.getRandomQuoteText(),
              sound: true,
              data: {
                timeId: time.id,
                type: "daily_reminder",
              },
            },
            trigger: {
              channelId: "default",
              hour: time.hour,
              minute: time.minute,
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
            },
          });

          console.log(
            `Scheduled notification for ${time.label} at ${
              time.hour
            }:${time.minute
              .toString()
              .padStart(2, "0")} with ID: ${notificationId}`
          );
        }
      }

      console.log(
        `${
          notificationTimes.filter((t) => t.enabled).length
        } notifications scheduled successfully`
      );
    } catch (error) {
      console.error("Error scheduling notifications:", error);
    }
  }

  static async scheduleDailyNotifications(): Promise<void> {
    if (Platform.OS === "web") {
      console.log("Notifications not supported on web");
      return;
    }

    try {
      // Cancel existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log("Notification permissions not granted");
        return;
      }

      // Morning notification (8 AM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Morning Reflection 🌅",
          body: this.getRandomQuoteText(),
          sound: true,
          data: { type: "morning_reminder" },
        },
        trigger: {
          channelId: "default",
          hour: 8,
          minute: 0,
          repeats: true,
        },
      });

      // Midday notification (12 PM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Midday Wisdom ☀️",
          body: this.getRandomQuoteText(),
          sound: true,
          data: { type: "midday_reminder" },
        },
        trigger: {
          channelId: "default",
          hour: 12,
          minute: 0,
          repeats: true,
        },
      });

      // Evening notification (8 PM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Evening Peace 🌙",
          body: this.getRandomQuoteText(),
          sound: true,
          data: { type: "evening_reminder" },
        },
        trigger: {
          channelId: "default",
          hour: 20,
          minute: 0,
          repeats: true,
        },
      });

      console.log("Daily notifications scheduled successfully");
    } catch (error) {
      console.error("Error scheduling notifications:", error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === "web") {
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All notifications cancelled");
    } catch (error) {
      console.error("Error cancelling notifications:", error);
    }
  }

  static getRandomQuoteText(): string {
    const spiritualMessages = [
      "Your daily spiritual journey awaits",
      "Listen to God's word and find peace",
      "Time for your spiritual reflection",
      "Let His teachings guide your heart",
      "Your soul thirsts for divine wisdom",
      "Come and receive today's blessing",
      "The Lord calls you to listen",
      "Find strength in His holy word",
    ];

    const randomMessage =
      spiritualMessages[Math.floor(Math.random() * spiritualMessages.length)];
    return randomMessage;
  }

  static getTimeEmoji(hour: number): string {
    if (hour >= 5 && hour < 12) return "🌅";
    if (hour >= 12 && hour < 17) return "☀️";
    if (hour >= 17 && hour < 21) return "🌆";
    return "🌙";
  }

  static async getScheduledNotifications() {
    if (Platform.OS === "web") {
      return [];
    }

    try {
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log(`Found ${notifications.length} scheduled notifications`);
      return notifications;
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  }

  static async testNotification(): Promise<void> {
    if (Platform.OS === "web") {
      console.log("Test notifications not supported on web");
      return;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log("Notification permissions not granted for test");
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification 🔔",
          body: "This is a test notification to verify everything is working!",
          sound: true,
          data: { type: "test" },
        },
        trigger: {
          channelId: "default",
          seconds: 2,
          repeats: false,
        },
      });

      console.log("Test notification scheduled for 2 seconds from now");
    } catch (error) {
      console.error("Error scheduling test notification:", error);
    }
  }
}
