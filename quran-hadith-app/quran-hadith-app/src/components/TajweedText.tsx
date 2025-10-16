'use client';

import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TajweedApplication {
  id: number;
  startPosition: number;
  endPosition: number;
  affectedText: string;
  notes?: string | null;
  rule: {
    id: number;
    ruleId: string;
    name: string;
    nameArabic: string;
    category: string;
    description: string;
    color: string | null;
    textColor: string | null;
    examples: string[];
  };
}

interface TajweedTextProps {
  text: string;
  applications: TajweedApplication[];
  className?: string;
}

/**
 * TajweedText Component
 *
 * Displays Arabic Quranic text with color-coded Tajweed rules.
 * Each highlighted section shows a tooltip with the rule details.
 */
export default function TajweedText({
  text,
  applications,
  className = '',
}: TajweedTextProps) {
  if (!applications || applications.length === 0) {
    // No tajweed data, display plain text
    return (
      <p className={`text-right leading-loose ${className}`} dir="rtl">
        {text}
      </p>
    );
  }

  // Sort applications by start position
  const sortedApps = [...applications].sort(
    (a, b) => a.startPosition - b.startPosition
  );

  // Build segments of the text with tajweed highlighting
  const segments: Array<{
    text: string;
    application?: TajweedApplication;
  }> = [];

  let currentPos = 0;

  sortedApps.forEach((app) => {
    // Add plain text before this application
    if (app.startPosition > currentPos) {
      segments.push({
        text: text.slice(currentPos, app.startPosition),
      });
    }

    // Add highlighted text for this application
    segments.push({
      text: text.slice(app.startPosition, app.endPosition + 1),
      application: app,
    });

    currentPos = app.endPosition + 1;
  });

  // Add remaining plain text after all applications
  if (currentPos < text.length) {
    segments.push({
      text: text.slice(currentPos),
    });
  }

  return (
    <TooltipProvider>
      <p className={`text-right leading-loose ${className}`} dir="rtl">
        {segments.map((segment, index) => {
          if (segment.application) {
            const app = segment.application;
            const bgColor = app.rule.color || '#FFD700';
            const textColor = app.rule.textColor || '#000000';

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <span
                    className="cursor-help px-1 rounded transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                    }}
                  >
                    {segment.text}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    <div>
                      <p className="font-bold">{app.rule.name}</p>
                      <p className="text-sm text-gray-400">{app.rule.nameArabic}</p>
                    </div>
                    <p className="text-sm">{app.rule.description}</p>
                    {app.rule.examples && app.rule.examples.length > 0 && (
                      <div className="border-t border-gray-700 pt-2">
                        <p className="text-xs font-semibold mb-1">Examples:</p>
                        {app.rule.examples.map((example, i) => (
                          <p key={i} className="text-sm text-right" dir="rtl">
                            {example}
                          </p>
                        ))}
                      </div>
                    )}
                    {app.notes && (
                      <div className="border-t border-gray-700 pt-2">
                        <p className="text-xs italic text-gray-400">{app.notes}</p>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          }

          return <span key={index}>{segment.text}</span>;
        })}
      </p>
    </TooltipProvider>
  );
}
