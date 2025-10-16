/**
 * Islamic Theme Configuration
 *
 * Multiple authentic Islamic color schemes for the app.
 * Each theme includes HSL values for primary and accent colors.
 */

export interface IslamicTheme {
  name: string;
  label: string;
  description: string;
  colors: {
    primary: string;
    accent: string;
    secondary?: string;
  };
}

export const islamicThemes: IslamicTheme[] = [
  {
    name: 'classic',
    label: 'Classic Islamic',
    description: 'Deep teal and rich gold - Traditional Islamic colors',
    colors: {
      primary: '160 60% 45%',  // Deep Islamic teal
      accent: '43 74% 49%',    // Rich gold
      secondary: '160 45% 95%', // Light teal tint
    },
  },
  {
    name: 'madinah',
    label: 'Madinah',
    description: 'Madinah blue and golden dome',
    colors: {
      primary: '210 70% 45%',  // Madinah blue
      accent: '38 92% 50%',    // Golden dome
      secondary: '195 60% 50%', // Sky blue
    },
  },
  {
    name: 'mecca',
    label: 'Mecca',
    description: 'Warm earth tones of Kaaba stone and golden door',
    colors: {
      primary: '25 45% 40%',   // Kaaba stone brown
      accent: '43 74% 49%',    // Golden door
      secondary: '355 65% 45%', // Kiswa red
    },
  },
  {
    name: 'night',
    label: 'Night Prayer',
    description: 'Deep purple and soft gold for night reading',
    colors: {
      primary: '240 30% 35%',  // Deep midnight purple
      accent: '43 60% 70%',    // Soft warm gold
      secondary: '240 20% 25%', // Dark purple-gray
    },
  },
  {
    name: 'emerald',
    label: 'Emerald Garden',
    description: 'Rich emerald and amber - Paradise garden colors',
    colors: {
      primary: '155 70% 40%',  // Deep emerald
      accent: '30 85% 55%',    // Warm amber
      secondary: '155 50% 90%', // Light emerald
    },
  },
];

export const defaultTheme = islamicThemes[0]; // Classic

/**
 * Apply theme to the document
 */
export function applyTheme(theme: IslamicTheme) {
  const root = document.documentElement;

  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--accent', theme.colors.accent);

  if (theme.colors.secondary) {
    root.style.setProperty('--secondary', theme.colors.secondary);
  }

  // Store preference in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('islamic-theme', theme.name);
  }
}

/**
 * Get saved theme or default
 */
export function getSavedTheme(): IslamicTheme {
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  const savedThemeName = localStorage.getItem('islamic-theme');

  if (savedThemeName) {
    const theme = islamicThemes.find(t => t.name === savedThemeName);
    if (theme) {
      return theme;
    }
  }

  return defaultTheme;
}

/**
 * Initialize theme on app load
 */
export function initializeTheme() {
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);
}
