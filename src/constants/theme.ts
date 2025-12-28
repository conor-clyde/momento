// src/constants/theme.ts

export const colors = {
  primary: {
    main: "#6366F1",      // Indigo - modern, professional
    light: "#A5B4FC",
    dark: "#4338CA",
    muted: "#E0E7FF",
  },
  background: {
    main: "#F8FAFC",      // Warm off-white
    card: "#FFFFFF",
    white: "#FFFFFF",
    light: "#F1F5F9",
    dark: "#0F172A",
  },
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
    tertiary: "#94A3B8",
    light: "#CBD5E1",
    white: "#FFFFFF",
  },
  border: {
    light: "#E2E8F0",
    medium: "#CBD5E1",
    dark: "#94A3B8",
  },
  state: {
    error: "#EF4444",
    success: "#22C55E",
    warning: "#F59E0B",
    disabled: "#CBD5E1",
  },
  accent: {
    gold: "#FFD700",
    coral: "#FF6B6B",
  },
} as const;


export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;


export const typography = {
  fontFamily: {
    default: "System", // System font for most text
    handwritten: "Caveat", // Handwritten style for titles/captions
  },
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    giant: 32,
  },
  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;



export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  large: {
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;

