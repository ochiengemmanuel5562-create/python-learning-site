const PROGRESS_KEY = "pythonSiteProgress";
const THEME_KEY = "pythonSiteTheme";

export function loadProgress() {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

export function saveProgress(completedLessons) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedLessons));
  } catch (error) {
    console.log("Could not save progress:", error);
  }
}

export function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      return saved === "dark";
    }
  } catch (error) {
    console.log("Could not read theme:", error);
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function saveTheme(isDark) {
  try {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  } catch (error) {
    console.log("Could not save theme:", error);
  }
}