"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Asegura que el componente se ha montado para evitar errores de hidratación
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const changeThemeHandler = () =>
    setTheme(theme === "dark" ? "light" : "dark");

  return theme === "dark" ? (
    <Sun size={24} onClick={changeThemeHandler} className="cursor-pointer" />
  ) : (
    <Moon size={24} onClick={changeThemeHandler} className="cursor-pointer" />
  );
}
