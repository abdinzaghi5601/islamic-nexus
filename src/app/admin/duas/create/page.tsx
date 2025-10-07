'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface DuaCategory {
  id: number;
  name: string;
  nameArabic: string | null;
}

export default function CreateDuaPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    titleArabic: '',
    textArabic: '',
    textEnglish: '',
    transliteration: '',
    reference: '',
    tags: '',
    benefits: '',
    occasion: '',
  });

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/duas/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
          if (data.data.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: data.data[0].id.toString() }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/duas/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create dua');
      }

      setSuccess(true);
      // Reset form
      setFormData({
        categoryId: categories.length > 0 ? categories[0].id.toString() : '',
        title: '',
        titleArabic: '',
        textArabic: '',
        textEnglish: '',
        transliteration: '',
        reference: '',
        tags: '',
        benefits: '',
        occasion: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create dua');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/duas"
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
        >
          ← Back to Duas
        </Link>
        <h1 className="text-4xl font-bold mb-3 gradient-text">Add New Dua</h1>
        <p className="text-muted-foreground text-lg">
          Add authentic supplications from the Quran and Sunnah
        </p>
      </div>

      {success && (
        <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <p className="font-semibold">Dua created successfully!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <p className="font-semibold">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dua Information</CardTitle>
            <CardDescription>Fill in the details about the dua</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              {loadingCategories ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading categories...
                </div>
              ) : categories.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No categories found. Please create categories first.
                </div>
              ) : (
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {cat.nameArabic ? `(${cat.nameArabic})` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Title */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title (English) *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Dua for entering the mosque"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Title (Arabic)</label>
                <Input
                  value={formData.titleArabic}
                  onChange={(e) => setFormData({ ...formData, titleArabic: e.target.value })}
                  placeholder="دعاء دخول المسجد"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Arabic Text */}
            <div>
              <label className="block text-sm font-semibold mb-2">Dua Text (Arabic) *</label>
              <textarea
                value={formData.textArabic}
                onChange={(e) => setFormData({ ...formData, textArabic: e.target.value })}
                placeholder="اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[120px] font-arabic text-xl"
                dir="rtl"
                required
              />
            </div>

            {/* English Translation */}
            <div>
              <label className="block text-sm font-semibold mb-2">English Translation *</label>
              <textarea
                value={formData.textEnglish}
                onChange={(e) => setFormData({ ...formData, textEnglish: e.target.value })}
                placeholder="O Allah, open the doors of Your mercy for me"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[120px]"
                required
              />
            </div>

            {/* Transliteration */}
            <div>
              <label className="block text-sm font-semibold mb-2">Transliteration</label>
              <textarea
                value={formData.transliteration}
                onChange={(e) => setFormData({ ...formData, transliteration: e.target.value })}
                placeholder="Allahumma aftah li abwaba rahmatik"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px]"
              />
            </div>

            {/* Reference & Occasion */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Reference (Source)</label>
                <Input
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="e.g., Sahih Muslim 713"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Occasion (When to recite)</label>
                <Input
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  placeholder="e.g., When entering the mosque"
                />
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-semibold mb-2">Benefits</label>
              <textarea
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="Describe the benefits and virtues of this dua..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px]"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., mosque, prayer, mercy"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitting || categories.length === 0}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Dua...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Create Dua
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.href = '/duas'}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
