// Theme colors for the application
export const themeColors = {
  light: {
    primary: "#006fee",
    secondary: "#7c28cc",
    success: "#48d783",
    warning: "#f9ef66",
    danger: "#f7433c",
    background: "#ffffff",
    text: "#000000",
    muted: "#6c757d"
  },
  dark: {
    primary: "#0072d6",
    secondary: "#7824b4",
    success: "#369c5e",
    warning: "#b4a845",
    danger: "#ae362a",
    background: "#18181b",
    text: "#ffffff",
    muted: "#a1a1aa"
  }
};

/**
 * Get a theme color based on the current mode
 * @param colorName The color name to retrieve
 * @param isDark Whether to use dark mode colors
 * @returns The color hex code
 */
export const getThemeColor = (colorName: string, isDark = false): string => {
  const theme = isDark ? themeColors.dark : themeColors.light;
  return theme[colorName as keyof typeof theme] || "#000000";
};
