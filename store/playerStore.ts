import { getAudioAsset } from "@/lib/audioAssets";
import { getPeacefulAmbientMusic } from "@/lib/musicAssets";
import { Quote, RescueSession, StreakData } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PlayerState {
  currentQuote: Quote | null;
  playlist: Quote[];
  currentIndex: number;
  isPlaying: boolean;
  favorites: string[];
  history: string[];
  streakData: StreakData;
  dailyGoal: number;
  showCongratulationsModal: boolean;
  isTikTokMode: boolean;

  // Audio Player
  audioPlayer: any;
  backgroundMusicPlayer: any;
  isBackgroundMusicPlaying: boolean;

  // Rescue Mode
  isRescueModeActive: boolean;
  currentRescueSession: RescueSession | null;
  rescueSessions: RescueSession[];

  // Actions
  setAudioPlayer: (player: any) => void;
  setBackgroundMusicPlayer: (player: any) => void;
  playQuote: (quote: Quote, playlist?: Quote[]) => void;
  pauseQuote: () => void;
  resumeQuote: () => void;
  nextQuote: () => void;
  previousQuote: () => void;
  swipeToNext: () => Quote | null;
  swipeToPrevious: () => Quote | null;
  setTikTokMode: (enabled: boolean) => void;
  toggleFavorite: (quoteId: string) => void;
  addToHistory: (quoteId: string) => void;
  setDailyGoal: (goal: number) => void;
  incrementListenedCount: () => void;
  resetDailyProgressIfNeeded: () => void;
  dismissCongratulationsModal: () => void;

  // Background Music Actions
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;

  // Rescue Mode Actions
  startRescueMode: () => void;
  endRescueMode: (notes?: string) => void;
  updateRescueSession: (updates: Partial<RescueSession>) => void;
  addRescueQuoteViewed: (quoteId: string) => void;
  markPrayerCompleted: () => void;
  markBreathingCompleted: () => void;
}

const today = new Date().toISOString().split("T")[0];

const initialStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  totalDaysCompleted: 0,
  dailyProgress: [],
  todayProgress: {
    quotesListened: 0,
    date: today,
    completed: false,
  },
  weeklyStreak: 0,
  monthlyStreak: 0,
  totalQuotesListened: 0,
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentQuote: null,
      playlist: [],
      currentIndex: 0,
      isPlaying: false,
      favorites: [],
      history: [],
      streakData: initialStreakData,
      dailyGoal: 10, // Default to 10 teachings per day
      showCongratulationsModal: false,
      isTikTokMode: false,
      audioPlayer: null,
      backgroundMusicPlayer: null,
      isBackgroundMusicPlaying: false,

      // Rescue Mode
      isRescueModeActive: false,
      currentRescueSession: null,
      rescueSessions: [],

      setAudioPlayer: (player) => set({ audioPlayer: player }),
      setBackgroundMusicPlayer: (player) =>
        set({ backgroundMusicPlayer: player }),

      playQuote: async (quote, playlist = []) => {
        const { audioPlayer } = get();
        const newPlaylist = playlist.length > 0 ? playlist : [quote];
        const index = newPlaylist.findIndex((q) => q.id === quote.id);

        set({
          currentQuote: quote,
          playlist: newPlaylist,
          currentIndex: index >= 0 ? index : 0,
        });

        if (audioPlayer) {
          const audioAsset = getAudioAsset(quote.id);
          if (audioAsset) {
            await audioPlayer.replace(audioAsset);
            await audioPlayer.play();
          }
        }
      },

      pauseQuote: () => {
        const { audioPlayer } = get();
        if (audioPlayer) audioPlayer.pause();
      },

      resumeQuote: () => {
        const { audioPlayer } = get();
        if (audioPlayer) audioPlayer.play();
      },

      nextQuote: async () => {
        const { playlist, currentIndex, audioPlayer } = get();
        if (playlist.length > 0) {
          const nextIndex = (currentIndex + 1) % playlist.length;
          const nextQuote = playlist[nextIndex];
          set({
            currentQuote: nextQuote,
            currentIndex: nextIndex,
          });
          if (audioPlayer) {
            const audioAsset = getAudioAsset(nextQuote.id);
            if (audioAsset) {
              await audioPlayer.replace(audioAsset);
              await audioPlayer.play();
            }
          }
        }
      },

      previousQuote: async () => {
        const { playlist, currentIndex, audioPlayer } = get();
        if (playlist.length > 0) {
          const prevIndex =
            currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
          const prevQuote = playlist[prevIndex];
          set({
            currentQuote: prevQuote,
            currentIndex: prevIndex,
          });
          if (audioPlayer) {
            const audioAsset = getAudioAsset(prevQuote.id);
            if (audioAsset) {
              await audioPlayer.replace(audioAsset);
              await audioPlayer.play();
            }
          }
        }
      },

      swipeToNext: () => {
        const { isTikTokMode } = get();
        if (isTikTokMode) {
          get().nextQuote();
          return get().currentQuote;
        }
        return null;
      },

      swipeToPrevious: () => {
        const { isTikTokMode } = get();
        if (isTikTokMode) {
          get().previousQuote();
          return get().currentQuote;
        }
        return null;
      },

      setTikTokMode: (enabled) => {
        set({ isTikTokMode: enabled });
      },

      toggleFavorite: (quoteId) => {
        set((state) => ({
          favorites: state.favorites.includes(quoteId)
            ? state.favorites.filter((id) => id !== quoteId)
            : [...state.favorites, quoteId],
        }));
      },

      addToHistory: (quoteId) => {
        set((state) => {
          const newHistory = [
            quoteId,
            ...state.history.filter((id) => id !== quoteId),
          ];
          return { history: newHistory.slice(0, 50) }; // Keep last 50 items
        });
      },

      setDailyGoal: (goal) => {
        set({ dailyGoal: goal });
      },

      incrementListenedCount: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];

        // Reset progress if it's a new day
        if (state.streakData.todayProgress.date !== today) {
          state.resetDailyProgressIfNeeded();
        }

        const newListenedCount =
          state.streakData.todayProgress.quotesListened + 1;
        const goalCompleted = newListenedCount >= state.dailyGoal;

        // Check if this completes the daily goal for the first time today
        const shouldShowCongratulations =
          goalCompleted && !state.streakData.todayProgress.completed;

        let newStreakData = { ...state.streakData };

        // Update total quotes listened
        newStreakData.totalQuotesListened += 1;

        if (goalCompleted && !state.streakData.todayProgress.completed) {
          // Goal completed for the first time today
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          if (state.streakData.lastCompletedDate === yesterdayStr) {
            // Consecutive day
            newStreakData.currentStreak += 1;
          } else if (state.streakData.lastCompletedDate !== today) {
            // New streak or broken streak
            newStreakData.currentStreak = 1;
          }

          newStreakData.lastCompletedDate = today;
          newStreakData.totalDaysCompleted += 1;
          newStreakData.longestStreak = Math.max(
            newStreakData.longestStreak,
            newStreakData.currentStreak
          );

          // Update weekly and monthly streaks
          if (newStreakData.currentStreak % 7 === 0) {
            newStreakData.weeklyStreak += 1;
          }
          if (newStreakData.currentStreak % 30 === 0) {
            newStreakData.monthlyStreak += 1;
          }
        }

        newStreakData.todayProgress = {
          quotesListened: newListenedCount,
          date: today,
          completed: goalCompleted,
        };

        set({
          streakData: newStreakData,
          showCongratulationsModal: shouldShowCongratulations,
        });
      },

      resetDailyProgressIfNeeded: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];

        if (state.streakData.todayProgress.date !== today) {
          set({
            streakData: {
              ...state.streakData,
              todayProgress: {
                quotesListened: 0,
                date: today,
                completed: false,
              },
            },
          });
        }
      },

      dismissCongratulationsModal: () => {
        set({ showCongratulationsModal: false });
      },

      startBackgroundMusic: async () => {
        const { backgroundMusicPlayer, isBackgroundMusicPlaying } = get();
        if (backgroundMusicPlayer && !isBackgroundMusicPlaying) {
          try {
            const musicAsset = getPeacefulAmbientMusic();
            if (musicAsset) {
              await backgroundMusicPlayer.replace(musicAsset);
              backgroundMusicPlayer.loop = true;
              backgroundMusicPlayer.volume = 0.3; // Lower volume for background
              await backgroundMusicPlayer.play();
              set({ isBackgroundMusicPlaying: true });
            }
          } catch (error) {
            console.error("Error starting background music:", error);
          }
        }
      },

      stopBackgroundMusic: async () => {
        const { backgroundMusicPlayer, isBackgroundMusicPlaying } = get();
        if (backgroundMusicPlayer && isBackgroundMusicPlaying) {
          try {
            await backgroundMusicPlayer.pause();
            set({ isBackgroundMusicPlaying: false });
          } catch (error) {
            console.error("Error stopping background music:", error);
          }
        }
      },

      // Rescue Mode Actions
      startRescueMode: () => {
        const now = new Date().toISOString();
        const newSession: RescueSession = {
          id: Date.now().toString(),
          startTime: now,
          quotesViewed: [],
          prayerCompleted: false,
          breathingExerciseCompleted: false,
        };

        set({
          isRescueModeActive: true,
          currentRescueSession: newSession,
        });
      },

      endRescueMode: (notes) => {
        const state = get();
        if (state.currentRescueSession) {
          const now = new Date().toISOString();
          const startTime = new Date(state.currentRescueSession.startTime);
          const endTime = new Date(now);
          const duration = Math.floor(
            (endTime.getTime() - startTime.getTime()) / 1000
          );

          const completedSession: RescueSession = {
            ...state.currentRescueSession,
            endTime: now,
            duration,
            notes,
          };

          set({
            isRescueModeActive: false,
            currentRescueSession: null,
            rescueSessions: [completedSession, ...state.rescueSessions].slice(
              0,
              50
            ), // Keep last 50 sessions
          });
        }
      },

      updateRescueSession: (updates) => {
        const state = get();
        if (state.currentRescueSession) {
          set({
            currentRescueSession: {
              ...state.currentRescueSession,
              ...updates,
            },
          });
        }
      },

      addRescueQuoteViewed: (quoteId) => {
        const state = get();
        if (state.currentRescueSession) {
          const quotesViewed = [...state.currentRescueSession.quotesViewed];
          if (!quotesViewed.includes(quoteId)) {
            quotesViewed.push(quoteId);
            state.updateRescueSession({ quotesViewed });
          }
        }
      },

      markPrayerCompleted: () => {
        const state = get();
        if (state.currentRescueSession) {
          state.updateRescueSession({ prayerCompleted: true });
        }
      },

      markBreathingCompleted: () => {
        const state = get();
        if (state.currentRescueSession) {
          state.updateRescueSession({ breathingExerciseCompleted: true });
        }
      },
    }),
    {
      name: "player-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        history: state.history,
        streakData: state.streakData,
        dailyGoal: state.dailyGoal,
        rescueSessions: state.rescueSessions,
        isTikTokMode: state.isTikTokMode,
        // Exclude non-serializable or session-specific state
      }),
    }
  )
);

// Helper function to check if a quote is favorited
export const isFavorite = (quoteId: string) => {
  const { favorites } = usePlayerStore.getState();
  return favorites.includes(quoteId);
};

// Helper function to get current playlist
export const getCurrentPlaylist = () => {
  const { playlist } = usePlayerStore.getState();
  return playlist;
};
