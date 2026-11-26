import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', style = {}, showLabel = false, customLabel = null }) {
  const { theme, toggleTheme, isDark } = useTheme();

  const handleToggle = (e) => {
    toggleTheme(e);
  };

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${className}`}
      onClick={handleToggle}
      style={style}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle-icon">
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </span>
      {customLabel ? (
        <span className="theme-toggle-animated-label">{customLabel}</span>
      ) : (
        showLabel && (
          <span className="theme-toggle-label">
            {isDark ? 'Light mode' : 'Dark mode'}
          </span>
        )
      )}
    </button>
  );
}

