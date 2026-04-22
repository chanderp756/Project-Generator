/**
 * ThemeToggle.jsx
 *
 * Dark/Light theme toggle button component for header.
 * - Displays emoji icon and text label
 * - Shows current theme opposite on click
 * - Uses useTheme hook for theme management
 * - Styled with CSS variables for adaptation
 */

import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="toggle-icon">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
      <span className="toggle-text">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
