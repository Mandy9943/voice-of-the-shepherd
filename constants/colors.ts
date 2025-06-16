export const colors = {
  light: {
    background: "#FEFEFE",
    card: "#FFFFFF",
    text: "#1A1A1A",
    primary: "#8B5A3C",
    secondary: "#6B7280",
    accent: "#E25822",
    muted: "#F5F5F0",
    border: "#E5E0D5",
    rescue: {
      background: "#E8F4FD",
      primary: "#2563EB",
      secondary: "#1E40AF",
      success: "#059669",
      warning: "#D97706",
      danger: "#DC2626",
    },
  },
  dark: {
    background: "#0A0A0A",
    card: "#1A1A1A",
    text: "#FEFEFE",
    primary: "#D4A574",
    secondary: "#9CA3AF",
    accent: "#F97316",
    muted: "#2A2A2A",
    border: "#374151",
    rescue: {
      background: "#1E293B",
      primary: "#3B82F6",
      secondary: "#60A5FA",
      success: "#10B981",
      warning: "#F59E0B",
      danger: "#EF4444",
    },
  },
};

const colorPalette = [
  "#e6194B",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9A6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#a9a9a9",
];

const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const getColorForString = (str: string): string => {
  if (!str) return colorPalette[0];
  const hash = stringToHash(str);
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

export const categoryColors = new Proxy<{ [key: string]: string }>(
  {},
  {
    get: (target, property: string) => {
      return getColorForString(property);
    },
  }
);
