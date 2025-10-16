'use client';

interface BismillahDisplayProps {
  className?: string;
  showDecoration?: boolean;
}

/**
 * BismillahDisplay Component
 *
 * Displays "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" (In the name of Allah, the Most Gracious, the Most Merciful)
 * with beautiful decorative styling like quran.com
 *
 * Features:
 * - Centered decorative layout
 * - Uthmani font styling
 * - Optional decorative borders
 * - Responsive sizing
 */
export default function BismillahDisplay({
  className = '',
  showDecoration = true,
}: BismillahDisplayProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      {/* Decorative top border */}
      {showDecoration && (
        <div className="w-full max-w-md mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      )}

      {/* Bismillah Text */}
      <div className="relative">
        <p
          className="
            text-4xl
            md:text-5xl
            lg:text-6xl
            font-arabic-uthmani
            text-center
            leading-relaxed
            text-primary
            transition-all
            duration-300
            hover:scale-105
          "
          dir="rtl"
          lang="ar"
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>

        {/* Subtle glow effect */}
        {showDecoration && (
          <div
            className="absolute inset-0 blur-2xl opacity-20 -z-10"
            style={{
              background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Translation */}
      <p className="mt-4 text-sm md:text-base text-muted-foreground text-center italic">
        In the name of Allah, the Most Gracious, the Most Merciful
      </p>

      {/* Decorative bottom border */}
      {showDecoration && (
        <div className="w-full max-w-md mt-6">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      )}
    </div>
  );
}
