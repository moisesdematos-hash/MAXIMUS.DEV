import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDark 
          ? 'bg-blue-600 focus:ring-blue-500' 
          : 'bg-gray-300 focus:ring-gray-400'
      }`}
      aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-blue-600" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;