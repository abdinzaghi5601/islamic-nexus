'use client';

import { useState, useEffect } from 'react';
import { islamicThemes, applyTheme, getSavedTheme, type IslamicTheme } from '@/config/themes';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Palette } from 'lucide-react';

/**
 * Theme Switcher Component
 *
 * Allows users to switch between different Islamic color themes.
 * Themes are persisted to localStorage and applied globally.
 */
export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<IslamicTheme>(islamicThemes[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = getSavedTheme();
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const handleThemeChange = (theme: IslamicTheme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Change theme"
        >
          <Palette className="h-4 w-4" />
          <span className="sr-only">Change Islamic theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">Islamic Themes</h4>
            <p className="text-sm text-muted-foreground">
              Choose your preferred color scheme
            </p>
          </div>
          <div className="space-y-2">
            {islamicThemes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme)}
                className={`
                  w-full text-left px-4 py-3 rounded-lg transition-all
                  hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary
                  ${
                    currentTheme.name === theme.name
                      ? 'bg-primary/10 border-2 border-primary shadow-md'
                      : 'border-2 border-transparent bg-card'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
                      style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                      aria-hidden="true"
                    />
                    <div
                      className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
                      style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{theme.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {theme.description}
                    </div>
                  </div>
                  {currentTheme.name === theme.name && (
                    <div className="text-primary font-bold text-lg" aria-label="Selected">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
