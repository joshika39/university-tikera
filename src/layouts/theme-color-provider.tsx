import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeColorProvider() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const themeColor = document.querySelector('meta[name="theme-color"]');

    const effectiveTheme = theme === "system" ? systemTheme : theme;

    if (effectiveTheme === "dark") {
      themeColor?.setAttribute("content", "#0A0A0A");
    } else {
      themeColor?.setAttribute("content", "#FFFEFF");
    }
  }, [theme, systemTheme]);

  return null;
}
