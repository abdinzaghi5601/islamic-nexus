'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Oops! Something went wrong</h1>
            <p className="text-muted-foreground text-lg">
              We encountered an unexpected error. This might be due to a database connection issue or a temporary problem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" className="gap-2 w-full">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="w-full mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded-lg text-xs text-left overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </Card>
    </div>
  );
}
