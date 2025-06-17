import { NotificationService } from "@/services/notificationService";
import { PersonalInfo, RescueModeSettings, UserProfile } from "@/types";
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
  resetApp: () => Promise<void>;

  // Personal Info Actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  signContract: (signature: string) => void;

  // User Profile Actions
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  signInUser: (
    provider: "google" | "apple" | "email",
    userData: Partial<UserProfile>
  ) => void;
  signOutUser: () => void;

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
  signature: undefined,
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
  signature: undefined,
};

const initialState = {
  isDarkMode: false,
  enableBackgroundMusic: false,
  dailyNotifications: true,
  notificationTimes: defaultNotificationTimes,
  hasCompletedOnboarding: false,
  showTutorialOverlays: true,
  rescueModeSettings: initialRescueModeSettings,
  personalInfo: initialPersonalInfo,
  userProfile: initialUserProfile,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initialState,

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

      resetApp: async () => {
        await AsyncStorage.clear();
        set({
          isDarkMode: false,
          enableBackgroundMusic: false,
          dailyNotifications: true,
          notificationTimes: defaultNotificationTimes,
          hasCompletedOnboarding: false,
          showTutorialOverlays: true,
          rescueModeSettings: initialRescueModeSettings,
          personalInfo: initialPersonalInfo,
          userProfile: initialUserProfile,
        });
      },

      // Personal Info Actions
      updatePersonalInfo: (info: Partial<PersonalInfo>) => {
        set((state) => ({
          personalInfo: {
            ...state.personalInfo,
            ...info,
          },
        }));
      },

      signContract: (signature: string) => {
        const signatureDate = new Date().toISOString();
        set((state) => ({
          personalInfo: {
            ...state.personalInfo,
            hasSignedContract: true,
            signatureDate,
            signature,
          },
          userProfile: {
            ...state.userProfile,
            hasSignedContract: true,
            signatureDate,
            signature,
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
            signature: get().userProfile.signature,
          },
        });
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
      onRehydrateStorage: () => async (state) => {
        // Schedule notifications if they're enabled when the app loads
        if (state?.dailyNotifications && state?.notificationTimes) {
          const scheduled =
            await NotificationService.getScheduledNotifications();
          const enabledInStore = state.notificationTimes.filter(
            (t) => t.enabled
          ).length;

          if (scheduled.length !== enabledInStore) {
            console.log(
              `Mismatch detected. Scheduled: ${scheduled.length}, Enabled in store: ${enabledInStore}. Rescheduling...`
            );
            await NotificationService.scheduleCustomNotifications(
              state.notificationTimes
            );
          } else {
            console.log(
              "Notifications are in sync. Skipping reschedule on load."
            );
          }
        }
      },
    }
  )
);
