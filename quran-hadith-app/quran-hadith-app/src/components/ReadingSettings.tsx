'use client';

import { useState } from 'react';
import { Settings2, Type, AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export interface ReadingSettingsConfig {
  fontSize: number; // 16-48px
  lineSpacing: number; // 1.5-3
  fontStyle: 'uthmani' | 'simple';
  showTranslations: boolean;
}

interface ReadingSettingsProps {
  config: ReadingSettingsConfig;
  onChange: (config: ReadingSettingsConfig) => void;
}

/**
 * ReadingSettings Component
 *
 * A popover panel that allows users to customize their Quran reading experience:
 * - Font size adjustment
 * - Line spacing
 * - Font style (Uthmani/Simple)
 * - Translation visibility
 */
export default function ReadingSettings({
  config,
  onChange,
}: ReadingSettingsProps) {
  const handleFontSizeChange = (value: number[]) => {
    onChange({ ...config, fontSize: value[0] });
  };

  const handleLineSpacingChange = (value: number[]) => {
    onChange({ ...config, lineSpacing: value[0] });
  };

  const toggleFontStyle = () => {
    onChange({
      ...config,
      fontStyle: config.fontStyle === 'uthmani' ? 'simple' : 'uthmani',
    });
  };

  const toggleTranslations = () => {
    onChange({ ...config, showTranslations: !config.showTranslations });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Reading Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h4 className="font-semibold text-base mb-1">Reading Settings</h4>
            <p className="text-xs text-muted-foreground">
              Customize your reading experience
            </p>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm">
                <Type className="h-4 w-4" />
                Font Size
              </Label>
              <span className="text-xs text-muted-foreground">
                {config.fontSize}px
              </span>
            </div>
            <Slider
              value={[config.fontSize]}
              onValueChange={handleFontSizeChange}
              min={16}
              max={48}
              step={2}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          {/* Line Spacing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm">
                <AlignJustify className="h-4 w-4" />
                Line Spacing
              </Label>
              <span className="text-xs text-muted-foreground">
                {config.lineSpacing.toFixed(1)}x
              </span>
            </div>
            <Slider
              value={[config.lineSpacing]}
              onValueChange={handleLineSpacingChange}
              min={1.5}
              max={3}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Compact</span>
              <span>Spacious</span>
            </div>
          </div>

          {/* Font Style Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm">Arabic Font Style</Label>
            <Button
              variant={config.fontStyle === 'uthmani' ? 'default' : 'outline'}
              size="sm"
              onClick={toggleFontStyle}
            >
              {config.fontStyle === 'uthmani' ? 'Uthmani' : 'Simple'}
            </Button>
          </div>

          {/* Translations Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show Translations</Label>
            <Button
              variant={config.showTranslations ? 'default' : 'outline'}
              size="sm"
              onClick={toggleTranslations}
            >
              {config.showTranslations ? 'On' : 'Off'}
            </Button>
          </div>

          {/* Preview Text */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Preview:</p>
            <div
              className={`
                ${config.fontStyle === 'uthmani' ? 'font-arabic-uthmani' : 'font-arabic-simple'}
                text-right
                p-3
                bg-muted/30
                rounded-lg
              `}
              dir="rtl"
              style={{
                fontSize: `${config.fontSize}px`,
                lineHeight: config.lineSpacing,
              }}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
