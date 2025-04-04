"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "data-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove old theme attribute
    root.removeAttribute(attribute);

    // Set the new theme attribute
    const datasetKey = attribute.replace("data-", "");
    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.dataset[datasetKey] = systemTheme;
      root.classList.add(systemTheme);
      root.classList.remove(systemTheme === "dark" ? "light" : "dark");
    } else {
      root.dataset[datasetKey] = theme;
      root.classList.add(theme);
      root.classList.remove(theme === "dark" ? "light" : "dark");
    }
  }, [theme, attribute, enableSystem]);

  // Handle system theme changes
  useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        const datasetKey = attribute.replace("data-", "");
        const systemTheme = mediaQuery.matches ? "dark" : "light";

        if (disableTransitionOnChange) {
          root.classList.add("no-transition");
          root.dataset[datasetKey] = systemTheme;
          root.classList.add(systemTheme);
          root.classList.remove(systemTheme === "dark" ? "light" : "dark");

          // Force repaint to make the transition work
          document.body.offsetHeight;
          root.classList.remove("no-transition");
        } else {
          root.dataset[datasetKey] = systemTheme;
          root.classList.add(systemTheme);
          root.classList.remove(systemTheme === "dark" ? "light" : "dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, attribute, enableSystem, disableTransitionOnChange]);

  // Add transition style if needed
  useEffect(() => {
    if (!disableTransitionOnChange) return;

    // Add global styles to disable transitions during theme change
    const style = document.createElement("style");
    style.innerHTML = `
      .no-transition,
      .no-transition * {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, [disableTransitionOnChange]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
