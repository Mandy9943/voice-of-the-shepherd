import { Platform } from "react-native";

export const typography = {
  quoteFont: Platform.select({
    ios: "Baskerville",
    android: "serif",
    default: "serif",
  }),
  bodyFont: Platform.select({
    ios: "Avenir-Book",
    android: "sans-serif",
    default: "sans-serif",
  }),
  headingFont: Platform.select({
    ios: "Avenir-Medium",
    android: "sans-serif-medium",
    default: "sans-serif-medium",
  }),
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  weights: {
    thin: "100" as const,
    extralight: "200" as const,
    light: "300" as const,
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
    black: "900" as const,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
