'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Lightbulb,
  Languages,
  Settings2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export type ReadingMode = 'reading' | 'study' | 'comparison';

export interface ReadingModeConfig {
  mode: ReadingMode;
  showArabic: boolean;
  showTranslations: boolean;
  showTafsir: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  arabicFont: 'uthmani' | 'simple';
}

interface ReadingModeSelectorProps {
  currentMode: ReadingMode;
  onModeChange: (mode: ReadingMode) => void;
  config: ReadingModeConfig;
  onConfigChange: (config: Partial<ReadingModeConfig>) => void;
}

const modes = [
  {
    id: 'reading' as ReadingMode,
    name: 'Reading Mode',
    icon: BookOpen,
    description: 'Clean, minimal interface for focused reading',
    color: 'from-emerald-500 to-teal-600',
    features: [
      'Distraction-free layout',
      'Optimized text spacing',
      'Quick translation toggle',
      'Smooth scrolling',
    ],
    defaultConfig: {
      showArabic: true,
      showTranslations: true,
      showTafsir: false,
      fontSize: 'medium' as const,
      arabicFont: 'uthmani' as const,
    },
  },
  {
    id: 'study' as ReadingMode,
    name: 'Study Mode',
    icon: Lightbulb,
    description: 'Comprehensive view with tafsir and related content',
    color: 'from-blue-500 to-indigo-600',
    features: [
      'Expanded tafsir commentary',
      'Related hadiths display',
      'Word-by-word analysis',
      'Cross-references',
    ],
    defaultConfig: {
      showArabic: true,
      showTranslations: true,
      showTafsir: true,
      fontSize: 'medium' as const,
      arabicFont: 'uthmani' as const,
    },
  },
  {
    id: 'comparison' as ReadingMode,
    name: 'Comparison Mode',
    icon: Languages,
    description: 'Side-by-side translation comparison',
    color: 'from-purple-500 to-violet-600',
    features: [
      'Multiple translations',
      'Side-by-side layout',
      'Translation highlighting',
      'Easy comparison tools',
    ],
    defaultConfig: {
      showArabic: true,
      showTranslations: true,
      showTafsir: false,
      fontSize: 'small' as const,
      arabicFont: 'uthmani' as const,
    },
  },
];

const fontSizes = [
  { id: 'small', label: 'Small', className: 'text-sm' },
  { id: 'medium', label: 'Medium', className: 'text-base' },
  { id: 'large', label: 'Large', className: 'text-lg' },
  { id: 'extra-large', label: 'Extra Large', className: 'text-xl' },
];

export default function ReadingModeSelector({
  currentMode,
  onModeChange,
  config,
  onConfigChange,
}: ReadingModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentModeData = modes.find((m) => m.id === currentMode);
  const CurrentModeIcon = currentModeData?.icon || BookOpen;

  const handleModeChange = (mode: ReadingMode) => {
    const modeData = modes.find((m) => m.id === mode);
    if (modeData) {
      onModeChange(mode);
      onConfigChange({
        mode,
        ...modeData.defaultConfig,
      });
    }
  };

  // Save config to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quranReadingConfig', JSON.stringify(config));
    }
  }, [config]);

  return (
    <div className="flex items-center gap-2">
      {/* Current Mode Badge */}
      <Badge
        variant="outline"
        className="gap-2 bg-background/80 backdrop-blur-sm cursor-pointer hover:bg-muted/80 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <CurrentModeIcon className="h-3 w-3" />
        {currentModeData?.name}
      </Badge>

      {/* Mode Selector Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-background/80 backdrop-blur-sm"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Reading Mode & Settings</DialogTitle>
            <DialogDescription>
              Choose your preferred reading mode and customize your experience
            </DialogDescription>
          </DialogHeader>

          {/* Mode Selection */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Reading Mode</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {modes.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = currentMode === mode.id;

                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleModeChange(mode.id)}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                        isActive
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-br ${mode.color} flex-shrink-0`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>

                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold text-base">{mode.name}</h4>
                          <p className="text-sm text-muted-foreground">{mode.description}</p>

                          <ul className="space-y-1 mt-3">
                            {mode.features.slice(0, 2).map((feature, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="text-primary">•</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Display Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Display Settings</h3>

              {/* Font Size */}
              <div>
                <label className="text-sm font-medium mb-2 block">Font Size</label>
                <div className="flex gap-2 flex-wrap">
                  {fontSizes.map((size) => (
                    <Button
                      key={size.id}
                      variant={config.fontSize === size.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onConfigChange({ fontSize: size.id as any })}
                    >
                      {size.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Arabic Font */}
              <div>
                <label className="text-sm font-medium mb-2 block">Arabic Script</label>
                <div className="flex gap-2">
                  <Button
                    variant={config.arabicFont === 'uthmani' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onConfigChange({ arabicFont: 'uthmani' })}
                  >
                    Uthmani (Traditional)
                  </Button>
                  <Button
                    variant={config.arabicFont === 'simple' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onConfigChange({ arabicFont: 'simple' })}
                  >
                    Simple (Modern)
                  </Button>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-3">
                <label className="text-sm font-medium block">Display Options</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Translations</span>
                    <Button
                      variant={config.showTranslations ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        onConfigChange({ showTranslations: !config.showTranslations })
                      }
                    >
                      {config.showTranslations ? 'On' : 'Off'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Tafsir</span>
                    <Button
                      variant={config.showTafsir ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onConfigChange({ showTafsir: !config.showTafsir })}
                    >
                      {config.showTafsir ? 'On' : 'Off'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex justify-end pt-4">
              <Button onClick={() => setIsOpen(false)} size="lg" className="px-8">
                Apply Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
