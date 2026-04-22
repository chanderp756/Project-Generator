/**
 * ThemeContext.jsx
 *
 * Provides dark/light mode theme management using React Context API.
 * - Manages theme state (dark | light)
 * - Persists preference in localStorage
 * - Applies theme via data-theme attribute on document root
 * - Default theme: dark mode
 */

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

/**
 * ThemeProvider – Wraps the application to provide theme context.
 *
 * Props:
 *   children: React components to render inside the provider
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  // ── Initialize theme from localStorage on mount ──────────────────
  useEffect(() => {
    try {
      // Check localStorage for saved preference
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setTheme(savedTheme);
      } else {
        // Default to dark mode
        setTheme('dark');
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
      setTheme('dark');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Apply theme to document and persist to localStorage ──────────
  useEffect(() => {
    if (isLoading) return;

    try {
      // Apply theme via data-theme attribute
      document.documentElement.setAttribute('data-theme', theme);
      
      // Persist to localStorage
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [theme, isLoading]);

  // ── Toggle theme ─────────────────────────────────────────────────
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme – Hook to access theme context.
 *
 * Returns:
 *   { theme, toggleTheme, isLoading }
 *
 * Throws:
 *   Error if used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
