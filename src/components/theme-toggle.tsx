"use client";

import { toggleTheme, useTheme } from "@/lib/theme";
import { Moon, Sun } from "./icons";

export function ThemeToggle({ labels }: { labels: { light: string; dark: string } }) {
  const theme = useTheme();
  const label = theme === "dark" ? labels.light : labels.dark;
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="rounded-full border border-border p-1.5 text-muted transition-colors hover:border-foreground hover:text-foreground"
    >
      {theme === "dark" ? <Sun width={15} height={15} /> : <Moon width={15} height={15} />}
    </button>
  );
}
