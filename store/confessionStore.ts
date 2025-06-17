import { CommonSin, ConfessionData, SpiritualGoal } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ConfessionState extends ConfessionData {
  // Actions
  setLastConfessionDate: (date: string) => void;
  updateLastConfessionDate: (date: Date) => void;
  addSpiritualGoal: (sin: string, virtue: string, description?: string) => void;
  removeSpiritualGoal: (id: string) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  toggleGoalActive: (id: string) => void;
  toggleGoalCompleted: (id: string) => void;
  setConfessionReminder: (enabled: boolean) => void;
  setReminderDays: (days: number) => void;
  getDaysSinceLastConfession: () => number | null;
  shouldShowConfessionReminder: () => boolean;
}

export const commonSins: CommonSin[] = [
  // Pride
  {
    id: "1",
    sin: "Pride",
    virtue: "Humility",
    description: "Excessive self-love and arrogance",
    category: "pride",
  },
  {
    id: "2",
    sin: "Vanity",
    virtue: "Modesty",
    description: "Excessive concern with appearance",
    category: "pride",
  },
  {
    id: "3",
    sin: "Boasting",
    virtue: "Humility",
    description: "Bragging about achievements",
    category: "pride",
  },

  // Wrath
  {
    id: "4",
    sin: "Anger",
    virtue: "Patience",
    description: "Uncontrolled anger and rage",
    category: "wrath",
  },
  {
    id: "5",
    sin: "Impatience",
    virtue: "Patience",
    description: "Lack of patience with others",
    category: "wrath",
  },
  {
    id: "6",
    sin: "Resentment",
    virtue: "Forgiveness",
    description: "Holding grudges against others",
    category: "wrath",
  },

  // Envy
  {
    id: "7",
    sin: "Jealousy",
    virtue: "Contentment",
    description: "Envying others possessions or success",
    category: "envy",
  },
  {
    id: "8",
    sin: "Covetousness",
    virtue: "Gratitude",
    description: "Desiring what belongs to others",
    category: "envy",
  },

  // Greed
  {
    id: "9",
    sin: "Greed",
    virtue: "Generosity",
    description: "Excessive desire for wealth",
    category: "greed",
  },
  {
    id: "10",
    sin: "Selfishness",
    virtue: "Charity",
    description: "Putting self before others",
    category: "greed",
  },
  {
    id: "11",
    sin: "Materialism",
    virtue: "Detachment",
    description: "Excessive attachment to possessions",
    category: "greed",
  },

  // Sloth
  {
    id: "12",
    sin: "Laziness",
    virtue: "Diligence",
    description: "Avoiding work and responsibility",
    category: "sloth",
  },
  {
    id: "13",
    sin: "Procrastination",
    virtue: "Promptness",
    description: "Delaying important tasks",
    category: "sloth",
  },
  {
    id: "14",
    sin: "Spiritual Apathy",
    virtue: "Devotion",
    description: "Neglecting prayer and spiritual duties",
    category: "sloth",
  },

  // Gluttony
  {
    id: "15",
    sin: "Overeating",
    virtue: "Temperance",
    description: "Eating beyond necessity",
    category: "gluttony",
  },
  {
    id: "16",
    sin: "Excessive Drinking",
    virtue: "Sobriety",
    description: "Drinking alcohol to excess",
    category: "gluttony",
  },

  // Lust
  {
    id: "17",
    sin: "Impure Thoughts",
    virtue: "Purity",
    description: "Entertaining lustful thoughts",
    category: "lust",
  },
  {
    id: "18",
    sin: "Inappropriate Desires",
    virtue: "Chastity",
    description: "Desires contrary to Gods will",
    category: "lust",
  },

  // Additional common sins
  {
    id: "19",
    sin: "Lying",
    virtue: "Honesty",
    description: "Speaking falsehoods",
    category: "pride",
  },
  {
    id: "20",
    sin: "Gossiping",
    virtue: "Discretion",
    description: "Speaking ill of others",
    category: "wrath",
  },
  {
    id: "21",
    sin: "Judging Others",
    virtue: "Compassion",
    description: "Harsh judgment of others",
    category: "pride",
  },
  {
    id: "22",
    sin: "Unforgiveness",
    virtue: "Mercy",
    description: "Refusing to forgive others",
    category: "wrath",
  },
  {
    id: "23",
    sin: "Worry",
    virtue: "Trust",
    description: "Excessive anxiety and worry",
    category: "sloth",
  },
  {
    id: "24",
    sin: "Complaining",
    virtue: "Gratitude",
    description: "Constant complaining and negativity",
    category: "wrath",
  },
];

const initialConfessionData: ConfessionData = {
  lastConfessionDate: null,
  spiritualGoals: [],
  confessionReminder: true,
  reminderDays: 30, // Default to monthly confession reminder
};

export const useConfessionStore = create<ConfessionState>()(
  persist(
    (set, get) => ({
      ...initialConfessionData,

      setLastConfessionDate: (date) => {
        set({ lastConfessionDate: date });
      },

      updateLastConfessionDate: (date) => {
        set({ lastConfessionDate: date.toISOString().split("T")[0] });
      },

      addSpiritualGoal: (sin, virtue, description = "") => {
        const goalText = description
          ? `Overcome ${sin} through ${virtue}: ${description}`
          : `Overcome ${sin} through ${virtue}`;
        const newGoal: SpiritualGoal = {
          id: Date.now().toString(),
          sin,
          virtue,
          description,
          progress: 0,
          dateAdded: new Date().toISOString().split("T")[0],
          isActive: true,
          completed: false,
          text: goalText,
        };

        set((state) => ({
          spiritualGoals: [...state.spiritualGoals, newGoal],
        }));
      },

      removeSpiritualGoal: (id) => {
        set((state) => ({
          spiritualGoals: state.spiritualGoals.filter((goal) => goal.id !== id),
        }));
      },

      updateGoalProgress: (id, progress) => {
        set((state) => ({
          spiritualGoals: state.spiritualGoals.map((goal) =>
            goal.id === id
              ? { ...goal, progress: Math.max(0, Math.min(100, progress)) }
              : goal
          ),
        }));
      },

      toggleGoalActive: (id) => {
        set((state) => ({
          spiritualGoals: state.spiritualGoals.map((goal) =>
            goal.id === id ? { ...goal, isActive: !goal.isActive } : goal
          ),
        }));
      },

      toggleGoalCompleted: (id) => {
        set((state) => ({
          spiritualGoals: state.spiritualGoals.map((goal) =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
          ),
        }));
      },

      setConfessionReminder: (enabled) => {
        set({ confessionReminder: enabled });
      },

      setReminderDays: (days) => {
        set({ reminderDays: days });
      },

      getDaysSinceLastConfession: () => {
        const { lastConfessionDate } = get();
        if (!lastConfessionDate) return null;

        const lastDate = new Date(lastConfessionDate);
        const today = new Date();
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
      },

      shouldShowConfessionReminder: () => {
        const { confessionReminder, reminderDays } = get();
        if (!confessionReminder) return false;

        const daysSince = get().getDaysSinceLastConfession();
        if (daysSince === null) return true; // Never confessed

        return daysSince >= reminderDays;
      },
    }),
    {
      name: "confession-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
