import Link from 'next/link';
import { Heart, Moon, Sun, Plane, Home, Users, Activity } from 'lucide-react';
import prisma from '@/lib/db/prisma';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

// Icon mapping for categories
const ICON_MAP: { [key: string]: any } = {
  heart: Heart,
  moon: Moon,
  sun: Sun,
  plane: Plane,
  home: Home,
  users: Users,
  activity: Activity,
};

async function getDuaCategories() {
  const categories = await prisma.duaCategory.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { duas: true },
      },
    },
  });

  return categories;
}

export default async function DuasPage() {
  const categories = await getDuaCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 gradient-text">Islamic Duas</h1>
        <p className="text-muted-foreground text-lg">
          Authentic supplications from the Quran and Sunnah
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="glass-card text-center py-16 rounded-2xl">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl font-semibold text-muted-foreground mb-2">
            No duas available yet
          </p>
          <p className="text-sm text-muted-foreground">
            Dua categories will appear here once they are added to the database
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon && ICON_MAP[category.icon] ? ICON_MAP[category.icon] : Heart;

            return (
              <Link
                key={category.id}
                href={`/duas/${category.slug}`}
                className="group glass-card hover-lift p-6 rounded-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl group-hover:shadow-lg transition-all duration-300">
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.nameArabic && (
                      <p className="text-lg font-arabic mb-2" dir="rtl">
                        {category.nameArabic}
                      </p>
                    )}
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {category._count.duas} {category._count.duas === 1 ? 'Dua' : 'Duas'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
