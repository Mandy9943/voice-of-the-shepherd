import { NotificationService } from "@/services/notificationService";
import {
  ConfessionData,
  ConfessionEntry,
  PersonalInfo,
  RescueModeSettings,
  UserProfile,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface NotificationTime {
  id: string;
  hour: number;
  minute: number;
  label: string;
  enabled: boolean;
}

interface SettingsState {
  isDarkMode: boolean;
  enableBackgroundMusic: boolean;
  dailyNotifications: boolean;
  notificationTimes: NotificationTime[];
  hasCompletedOnboarding: boolean;
  showTutorialOverlays: boolean;
  confessionData: ConfessionData;
  rescueModeSettings: RescueModeSettings;
  personalInfo: PersonalInfo;
  userProfile: UserProfile;

  // Actions
  toggleDarkMode: () => void;
  toggleBackgroundMusic: () => void;
  toggleDailyNotifications: () => void;
  addNotificationTime: (hour: number, minute: number, label: string) => void;
  removeNotificationTime: (id: string) => void;
  toggleNotificationTime: (id: string) => void;
  updateNotificationTime: (
    id: string,
    hour: number,
    minute: number,
    label: string
  ) => void;
  resetToDefaultTimes: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  dismissTutorialOverlays: () => void;

  // Personal Info Actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  signContract: () => void;

  // User Profile Actions
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  signInUser: (
    provider: "google" | "apple" | "email",
    userData: Partial<UserProfile>
  ) => void;
  signOutUser: () => void;

  // Confession Actions
  addConfessionEntry: (spiritualGoals: string[], notes?: string) => void;
  updateConfessionReminder: (
    enabled: boolean,
    frequency: "weekly" | "monthly" | "custom",
    customDays?: number
  ) => void;
  getLastConfessionDate: () => string | null;
  getDaysSinceLastConfession: () => number | null;
  getUpcomingConfessionReminder: () => string | null;

  // Rescue Mode Actions
  updateRescueModeSettings: (settings: Partial<RescueModeSettings>) => void;
  toggleRescueMode: () => void;
  addBlockedApp: (appName: string) => void;
  removeBlockedApp: (appName: string) => void;
  addEmergencyContact: (contact: string) => void;
  removeEmergencyContact: (contact: string) => void;
  addCustomPrayer: (prayer: string) => void;
  removeCustomPrayer: (prayer: string) => void;
}

const defaultNotificationTimes: NotificationTime[] = [
  {
    id: "1",
    hour: 8,
    minute: 0,
    label: "Morning Reflection",
    enabled: true,
  },
  {
    id: "2",
    hour: 12,
    minute: 0,
    label: "Midday Wisdom",
    enabled: true,
  },
  {
    id: "3",
    hour: 20,
    minute: 0,
    label: "Evening Peace",
    enabled: true,
  },
];

const initialConfessionData: ConfessionData = {
  lastConfessionDate: null,
  entries: [],
  reminderEnabled: false,
  reminderFrequency: "monthly",
  customReminderDays: 30,
};

const initialRescueModeSettings: RescueModeSettings = {
  enabled: true,
  autoPlayAudio: true,
  showBreathingExercise: true,
  blockAppsEnabled: false,
  blockedApps: [],
  emergencyContacts: [],
  customPrayers: [],
  rescueQuoteCategories: [
    "Temptation & Victory",
    "Peace & Courage",
    "Prayer & Faith",
  ],
};

const initialPersonalInfo: PersonalInfo = {
  name: "",
  age: undefined,
  spiritualGoals: [],
  hasSignedContract: false,
  signatureDate: undefined,
};

const initialUserProfile: UserProfile = {
  name: "",
  email: undefined,
  age: undefined,
  profilePicture: undefined,
  signInProvider: null,
  isSignedIn: false,
  signInDate: undefined,
  spiritualGoals: [],
  hasSignedContract: false,
  signatureDate: undefined,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      enableBackgroundMusic: false,
      dailyNotifications: true,
      notificationTimes: defaultNotificationTimes,
      hasCompletedOnboarding: false,
      showTutorialOverlays: true,
      confessionData: initialConfessionData,
      rescueModeSettings: initialRescueModeSettings,
      personalInfo: initialPersonalInfo,
      userProfile: initialUserProfile,

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      toggleBackgroundMusic: () =>
        set((state) => ({
          enableBackgroundMusic: !state.enableBackgroundMusic,
        })),

      toggleDailyNotifications: async () => {
        const currentState = get().dailyNotifications;
        const newState = !currentState;

        set({ dailyNotifications: newState });

        if (newState) {
          const { notificationTimes } = get();
          await NotificationService.scheduleCustomNotifications(
            notificationTimes
          );
        } else {
          await NotificationService.cancelAllNotifications();
        }
      },

      addNotificationTime: (hour, minute, label) => {
        const newTime: NotificationTime = {
          id: Date.now().toString(),
          hour,
          minute,
          label,
          enabled: true,
        };

        const notificationTimes = [...get().notificationTimes, newTime];
        set({ notificationTimes });

        // Reschedule notifications if they're enabled
        if (get().dailyNotifications) {
          NotificationService.scheduleCustomNotifications(notificationTimes);
        }
      },

      removeNotificationTime: (id) => {
        const notificationTimes = get().notificationTimes.filter(
          (time) => time.id !== id
        );
        set({ notificationTimes });

        // Reschedule notifications if they're enabled
        if (get().dailyNotifications) {
          NotificationService.scheduleCustomNotifications(notificationTimes);
        }
      },

      toggleNotificationTime: (id) => {
        const notificationTimes = get().notificationTimes.map((time) =>
          time.id === id ? { ...time, enabled: !time.enabled } : time
        );
        set({ notificationTimes });

        // Reschedule notifications if they're enabled
        if (get().dailyNotifications) {
          NotificationService.scheduleCustomNotifications(notificationTimes);
        }
      },

      updateNotificationTime: (id, hour, minute, label) => {
        const notificationTimes = get().notificationTimes.map((time) =>
          time.id === id ? { ...time, hour, minute, label } : time
        );
        set({ notificationTimes });

        // Reschedule notifications if they're enabled
        if (get().dailyNotifications) {
          NotificationService.scheduleCustomNotifications(notificationTimes);
        }
      },

      resetToDefaultTimes: () => {
        set({ notificationTimes: defaultNotificationTimes });

        // Reschedule notifications if they're enabled
        if (get().dailyNotifications) {
          NotificationService.scheduleCustomNotifications(
            defaultNotificationTimes
          );
        }
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true, showTutorialOverlays: false });
      },

      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false, showTutorialOverlays: true });
      },

      dismissTutorialOverlays: () => {
        set({ showTutorialOverlays: false });
      },

      // Personal Info Actions
      updatePersonalInfo: (info) => {
        set((state) => ({
          personalInfo: {
            ...state.personalInfo,
            ...info,
          },
        }));
      },

      signContract: () => {
        set((state) => ({
          personalInfo: {
            ...state.personalInfo,
            hasSignedContract: true,
            signatureDate: new Date().toISOString(),
          },
        }));
      },

      // User Profile Actions
      updateUserProfile: (profile) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...profile,
          },
        }));
      },

      signInUser: (provider, userData) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...userData,
            signInProvider: provider,
            isSignedIn: true,
            signInDate: new Date().toISOString(),
          },
        }));
      },

      signOutUser: () => {
        set({
          userProfile: {
            ...initialUserProfile,
            // Keep some data even after sign out
            spiritualGoals: get().userProfile.spiritualGoals,
            hasSignedContract: get().userProfile.hasSignedContract,
            signatureDate: get().userProfile.signatureDate,
          },
        });
      },

      // Confession Actions
      addConfessionEntry: (spiritualGoals, notes) => {
        const today = new Date().toISOString().split("T")[0];
        const newEntry: ConfessionEntry = {
          id: Date.now().toString(),
          date: today,
          spiritualGoals,
          notes,
        };

        const { confessionData } = get();
        const updatedData: ConfessionData = {
          ...confessionData,
          lastConfessionDate: today,
          entries: [newEntry, ...confessionData.entries].slice(0, 20), // Keep last 20 entries
        };

        set({ confessionData: updatedData });
      },

      updateConfessionReminder: (enabled, frequency, customDays) => {
        const { confessionData } = get();
        const updatedData: ConfessionData = {
          ...confessionData,
          reminderEnabled: enabled,
          reminderFrequency: frequency,
          customReminderDays: customDays,
        };

        set({ confessionData: updatedData });
      },

      getLastConfessionDate: () => {
        return get().confessionData.lastConfessionDate;
      },

      getDaysSinceLastConfession: () => {
        const lastDate = get().confessionData.lastConfessionDate;
        if (!lastDate) return null;

        const today = new Date();
        const confessionDate = new Date(lastDate);
        const diffTime = Math.abs(today.getTime() - confessionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
      },

      getUpcomingConfessionReminder: () => {
        const { confessionData } = get();
        if (
          !confessionData.reminderEnabled ||
          !confessionData.lastConfessionDate
        ) {
          return null;
        }

        const lastDate = new Date(confessionData.lastConfessionDate);
        let reminderDays: number;

        switch (confessionData.reminderFrequency) {
          case "weekly":
            reminderDays = 7;
            break;
          case "monthly":
            reminderDays = 30;
            break;
          case "custom":
            reminderDays = confessionData.customReminderDays || 30;
            break;
          default:
            reminderDays = 30;
        }

        const reminderDate = new Date(lastDate);
        reminderDate.setDate(reminderDate.getDate() + reminderDays);

        return reminderDate.toISOString().split("T")[0];
      },

      // Rescue Mode Actions
      updateRescueModeSettings: (settings) => {
        set((state) => ({
          rescueModeSettings: {
            ...state.rescueModeSettings,
            ...settings,
          },
        }));
      },

      toggleRescueMode: () => {
        set((state) => ({
          rescueModeSettings: {
            ...state.rescueModeSettings,
            enabled: !state.rescueModeSettings.enabled,
          },
        }));
      },

      addBlockedApp: (appName) => {
        const { rescueModeSettings } = get();
        if (!rescueModeSettings.blockedApps.includes(appName)) {
          set({
            rescueModeSettings: {
              ...rescueModeSettings,
              blockedApps: [...rescueModeSettings.blockedApps, appName],
            },
          });
        }
      },

      removeBlockedApp: (appName) => {
        const { rescueModeSettings } = get();
        set({
          rescueModeSettings: {
            ...rescueModeSettings,
            blockedApps: rescueModeSettings.blockedApps.filter(
              (app: string) => app !== appName
            ),
          },
        });
      },

      addEmergencyContact: (contact) => {
        const { rescueModeSettings } = get();
        if (!rescueModeSettings.emergencyContacts.includes(contact)) {
          set({
            rescueModeSettings: {
              ...rescueModeSettings,
              emergencyContacts: [
                ...rescueModeSettings.emergencyContacts,
                contact,
              ],
            },
          });
        }
      },

      removeEmergencyContact: (contact) => {
        const { rescueModeSettings } = get();
        set({
          rescueModeSettings: {
            ...rescueModeSettings,
            emergencyContacts: rescueModeSettings.emergencyContacts.filter(
              (c: string) => c !== contact
            ),
          },
        });
      },

      addCustomPrayer: (prayer) => {
        const { rescueModeSettings } = get();
        if (!rescueModeSettings.customPrayers.includes(prayer)) {
          set({
            rescueModeSettings: {
              ...rescueModeSettings,
              customPrayers: [...rescueModeSettings.customPrayers, prayer],
            },
          });
        }
      },

      removeCustomPrayer: (prayer) => {
        const { rescueModeSettings } = get();
        set({
          rescueModeSettings: {
            ...rescueModeSettings,
            customPrayers: rescueModeSettings.customPrayers.filter(
              (p: string) => p !== prayer
            ),
          },
        });
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Schedule notifications if they're enabled when the app loads
        if (state?.dailyNotifications && state?.notificationTimes) {
          console.log("Rehydrating notifications...");
          NotificationService.scheduleCustomNotifications(
            state.notificationTimes
          );
        }
      },
    }
  )
);
