'use client';

import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

interface TajweedRule {
  id: number;
  ruleId: string;
  name: string;
  nameArabic: string;
  category: string;
  description: string;
  color: string | null;
  textColor: string | null;
  examples: string[];
}

export default function TajweedGuidePage() {
  const [rules, setRules] = useState<TajweedRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTajweedRules();
  }, []);

  const fetchTajweedRules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tajweed/rules');
      if (!response.ok) throw new Error('Failed to fetch tajweed rules');
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Group rules by category
  const groupedRules = rules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, TajweedRule[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Tajweed Rules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchTajweedRules}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Tajweed Rules Guide
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Learn the rules of Tajweed to recite the Quran with proper pronunciation and beauty.
            Each rule is color-coded for easy identification.
          </p>
        </div>

        {/* Rules by Category */}
        <div className="space-y-12">
          {Object.entries(groupedRules).map(([category, categoryRules]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 mr-3 rounded-full"></span>
                {category} Rules
                <span className="ml-3 text-sm font-normal text-gray-400">
                  ({categoryRules.length})
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
                  >
                    {/* Rule Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {rule.name}
                        </h3>
                        <p className="text-lg text-gray-300" dir="rtl">
                          {rule.nameArabic}
                        </p>
                      </div>
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold flex-shrink-0 ml-4"
                        style={{
                          backgroundColor: rule.color || '#FFD700',
                          color: rule.textColor || '#000000',
                        }}
                      >
                        ت
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {rule.description}
                    </p>

                    {/* Examples */}
                    {rule.examples && rule.examples.length > 0 && (
                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-sm font-semibold text-gray-500 mb-2">
                          Examples:
                        </p>
                        <div className="space-y-2">
                          {rule.examples.map((example, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 rounded-lg text-right"
                              style={{
                                backgroundColor: `${rule.color || '#FFD700'}20`,
                              }}
                            >
                              <p
                                className="text-lg"
                                dir="rtl"
                                style={{
                                  color: rule.color || '#FFD700',
                                }}
                              >
                                {example}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-3">
            About Tajweed
          </h3>
          <p className="text-gray-400 leading-relaxed mb-4">
            Tajweed (تَجْوِيد) is the set of rules governing the way in which the words of the Quran
            should be pronounced during its recitation. It is derived from the Arabic root ج-و-د
            meaning "to make well" or "to improve."
          </p>
          <p className="text-gray-400 leading-relaxed">
            The science of Tajweed ensures that every letter is given its due right and that the
            recitation matches the way the Quran was revealed to Prophet Muhammad (peace be upon him).
          </p>
        </div>
      </div>
    </div>
  );
}
