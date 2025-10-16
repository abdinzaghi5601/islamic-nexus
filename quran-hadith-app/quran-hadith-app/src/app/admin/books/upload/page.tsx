'use client';

import { useState } from 'react';
import { Upload, BookOpen, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function UploadBookPage() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    titleArabic: '',
    author: '',
    authorArabic: '',
    category: 'Tafsir',
    language: 'English',
    description: '',
    publisher: '',
    publishYear: '',
    isbn: '',
    tags: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const categories = [
    'Tafsir',
    'Hadith Commentary',
    'Fiqh',
    'Seerah',
    'Aqeedah',
    'Islamic History',
    'Arabic Language',
    'General',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      if (!pdfFile) {
        throw new Error('Please select a PDF file');
      }

      const formDataToSend = new FormData();

      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add PDF file
      formDataToSend.append('pdf', pdfFile);

      const response = await fetch('/api/admin/books/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Server returned non-JSON response (likely HTML error page)
        const text = await response.text();
        if (text.includes('Request Entity Too Large') || text.includes('PayloadTooLargeError')) {
          throw new Error('File is too large. Maximum file size is 50MB. Try a smaller PDF.');
        }
        throw new Error('Server error: Unable to process upload. The file might be too large.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        titleArabic: '',
        author: '',
        authorArabic: '',
        category: 'Tafsir',
        language: 'English',
        description: '',
        publisher: '',
        publishYear: '',
        isbn: '',
        tags: '',
      });
      setPdfFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload book');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/books"
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
        >
          ← Back to Books
        </Link>
        <h1 className="text-4xl font-bold mb-3 gradient-text">Upload Islamic Book</h1>
        <p className="text-muted-foreground text-lg">
          Add a new book to the library with automatic text extraction for search
        </p>
      </div>

      {success && (
        <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <p className="font-semibold">Book uploaded successfully! Text extraction is processing in the background.</p>
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
            <CardTitle>Book Information</CardTitle>
            <CardDescription>Fill in the details about the book</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* PDF File Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2">PDF File *</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="pdf-upload"
                  required
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-semibold mb-1">
                    {pdfFile ? pdfFile.name : 'Click to upload PDF'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 50MB
                  </p>
                </label>
              </div>
            </div>

            {/* Title */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title (English) *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Tafsir Ibn Kathir"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Title (Arabic)</label>
                <Input
                  value={formData.titleArabic}
                  onChange={(e) => setFormData({ ...formData, titleArabic: e.target.value })}
                  placeholder="تفسير ابن كثير"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Author */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Author (English) *</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g., Ismail Ibn Kathir"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Author (Arabic)</label>
                <Input
                  value={formData.authorArabic}
                  onChange={(e) => setFormData({ ...formData, authorArabic: e.target.value })}
                  placeholder="إسماعيل بن كثير"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Category & Language */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Language *</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  required
                >
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Urdu">Urdu</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the book..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px]"
              />
            </div>

            {/* Publisher & Year */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Publisher</label>
                <Input
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  placeholder="e.g., Darussalam"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Publication Year</label>
                <Input
                  type="number"
                  value={formData.publishYear}
                  onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                  placeholder="e.g., 2000"
                  min="1000"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            {/* ISBN & Tags */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">ISBN</label>
                <Input
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  placeholder="e.g., 978-9960892733"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., tafsir, quran commentary, classical"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading & Extracting Text...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Upload Book
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.href = '/books'}
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
