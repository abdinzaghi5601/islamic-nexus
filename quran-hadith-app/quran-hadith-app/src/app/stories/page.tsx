'use client';

import { useState } from 'react';
import { Search, BookOpen, Users, Heart, Clock } from 'lucide-react';
import stories from '@/lib/data/islamic-stories.json';

type Category = 'All' | 'Prophets' | 'Sahaba' | 'Moral Stories' | 'Historical' | 'Seerat';

export default function StoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [expandedStory, setExpandedStory] = useState<number | null>(null);

  const categories: { name: Category; icon: any; color: string }[] = [
    { name: 'All', icon: BookOpen, color: 'from-purple-500 to-violet-600' },
    { name: 'Seerat', icon: BookOpen, color: 'from-green-500 to-emerald-600' },
    { name: 'Prophets', icon: BookOpen, color: 'from-emerald-500 to-teal-600' },
    { name: 'Sahaba', icon: Users, color: 'from-blue-500 to-indigo-600' },
    { name: 'Moral Stories', icon: Heart, color: 'from-rose-500 to-pink-600' },
    { name: 'Historical', icon: Clock, color: 'from-amber-500 to-orange-600' },
  ];

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.lesson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || story.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleStory = (id: number) => {
    setExpandedStory(expandedStory === id ? null : id);
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.name === category);
    return cat?.color || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 gradient-text">Islamic Stories</h1>
        <p className="text-muted-foreground text-lg">
          Inspiring stories from the Prophets, Sahaba, and Islamic history to learn and reflect upon
        </p>
      </div>

      {/* Stats Banner */}
      <div className="glass-card p-6 rounded-xl mb-8 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold gradient-text mb-2">{stories.length}</div>
            <div className="text-sm text-muted-foreground font-medium">Total Stories</div>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text mb-2">
              {stories.filter((s) => s.category === 'Prophets').length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Prophet Stories</div>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text mb-2">
              {stories.filter((s) => s.category === 'Sahaba').length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Sahaba Stories</div>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text mb-2">{filteredStories.length}</div>
            <div className="text-sm text-muted-foreground font-medium">Showing</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search stories by title, content, or lesson..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 glass-card rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-base"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'glass-card hover:bg-muted/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
                <span className="text-xs opacity-80">
                  ({category.name === 'All' ? stories.length : stories.filter((s) => s.category === category.name).length})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stories List */}
      <div className="space-y-6 max-w-5xl mx-auto">
        {filteredStories.map((story) => {
          const isExpanded = expandedStory === story.id;
          return (
            <div
              key={story.id}
              className="glass-card rounded-xl overflow-hidden hover-lift"
            >
              {/* Story Header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleStory(story.id)}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {story.title}
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(
                          story.category
                        )}`}
                      >
                        {story.category}
                      </span>
                      {story.reference && (
                        <span className="text-sm text-muted-foreground">
                          Reference: {story.reference}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="text-primary hover:text-accent transition-colors">
                    {isExpanded ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Story Preview */}
                {!isExpanded && (
                  <p className="text-muted-foreground leading-relaxed line-clamp-2">
                    {story.story}
                  </p>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Full Story */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      The Story
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      {story.story}
                    </p>
                  </div>

                  {/* Lesson */}
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                      <Heart className="h-5 w-5" />
                      The Lesson
                    </h4>
                    <p className="text-foreground leading-relaxed">
                      {story.lesson}
                    </p>
                  </div>

                  {/* Reference */}
                  {story.reference && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-semibold">Reference:</span>
                      <span>{story.reference}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredStories.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No stories found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Bottom Info Card */}
      <div className="mt-12 glass-card p-8 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-center gradient-text">
          Why Read Islamic Stories?
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Learn from the Best</h4>
            <p>
              The stories of the Prophets and righteous predecessors provide timeless examples of
              faith, patience, courage, and moral excellence that we can emulate in our own lives.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Strengthen Your Faith</h4>
            <p>
              These narratives demonstrate Allah's mercy, wisdom, and power, helping us develop
              deeper trust in Him and understanding of His divine plan for humanity.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Gain Wisdom</h4>
            <p>
              Each story contains profound lessons about human nature, divine justice, the
              importance of good character, and how to navigate life's challenges with faith.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Connect with Heritage</h4>
            <p>
              Understanding Islamic history and the lives of those who came before us connects us
              to our rich spiritual heritage and inspires us to follow in their footsteps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
