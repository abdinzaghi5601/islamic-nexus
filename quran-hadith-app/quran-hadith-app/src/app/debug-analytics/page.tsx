'use client';

import { useEffect, useState } from 'react';

export default function DebugAnalytics() {
  const [status, setStatus] = useState<any>({
    overview: 'checking...',
    prophets: 'checking...',
    themes: 'checking...',
    words: 'checking...',
    statistics: 'checking...',
  });
  const [prophetData, setProphetData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkEndpoints = async () => {
      const endpoints = ['overview', 'prophets', 'themes', 'words', 'statistics'];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`/api/analytics/${endpoint}`);
          const data = await response.json();

          if (data.success) {
            setStatus((prev: any) => ({ ...prev, [endpoint]: '✅ Working' }));
            if (endpoint === 'prophets') {
              setProphetData(data.data);
            }
          } else {
            setStatus((prev: any) => ({ ...prev, [endpoint]: `❌ Error: ${data.error}` }));
            setError(`${endpoint}: ${data.error}`);
          }
        } catch (err: any) {
          setStatus((prev: any) => ({ ...prev, [endpoint]: `❌ Failed: ${err.message}` }));
          setError(`${endpoint}: ${err.message}`);
        }
      }
    };

    checkEndpoints();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔧 Analytics Debug Page</h1>

      {/* API Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
        <h2 className="text-xl font-bold mb-4">API Endpoint Status</h2>
        <div className="space-y-2">
          {Object.entries(status).map(([endpoint, stat]) => (
            <div key={endpoint} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="font-mono">/api/analytics/{endpoint}</span>
              <span>{stat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
          <h3 className="font-bold mb-2">❌ Error Detected:</h3>
          <p>{error}</p>
          <div className="mt-4">
            <p className="font-semibold">Common fixes:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Check if DATABASE_URL is set in .env.local</li>
              <li>Make sure the database is running</li>
              <li>Verify you've run: npm run import:quran</li>
              <li>Check if Prisma is connected: npx prisma studio</li>
            </ul>
          </div>
        </div>
      )}

      {/* Prophet Data Display */}
      {prophetData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold mb-4">📊 Prophet Data Preview</h2>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Summary:</h3>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(prophetData.summary, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Sample Prophets (First 5):</h3>
            <div className="space-y-2">
              {prophetData.prophets?.slice(0, 5).map((p: any, idx: number) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="flex justify-between">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-primary font-bold">{p.mentions} mentions</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {p.nameArabic} - {p.surahsAppearing} surahs
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Test Bar Chart */}
          <div className="mt-6">
            <h3 className="font-semibold mb-4">📊 Test Bar Chart:</h3>
            <div className="space-y-2">
              {prophetData.prophets?.slice(0, 10).map((prophet: any, idx: number) => {
                const maxMentions = prophetData.summary.mostMentioned.mentions;
                const percentage = (prophet.mentions / maxMentions) * 100;
                const colors = [
                  'bg-gradient-to-r from-rose-500 to-pink-600',
                  'bg-gradient-to-r from-orange-500 to-amber-600',
                  'bg-gradient-to-r from-yellow-500 to-lime-600',
                  'bg-gradient-to-r from-green-500 to-emerald-600',
                  'bg-gradient-to-r from-teal-500 to-cyan-600',
                  'bg-gradient-to-r from-blue-500 to-indigo-600',
                  'bg-gradient-to-r from-violet-500 to-purple-600',
                  'bg-gradient-to-r from-fuchsia-500 to-pink-600',
                ];
                const colorClass = colors[idx % colors.length];

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-32 flex-shrink-0">
                      <p className="text-sm font-medium">{prophet.name}</p>
                      <p className="text-xs text-gray-500">{prophet.nameArabic}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <div
                          className={`h-full ${colorClass} flex items-center justify-end pr-2`}
                          style={{ width: `${percentage}%`, minWidth: '30px' }}
                        >
                          <span className="text-white font-bold text-xs">{prophet.mentions}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-right text-sm text-gray-600 dark:text-gray-400">
                      {prophet.surahsAppearing} surahs
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
        <h3 className="font-bold mb-2">📝 Next Steps:</h3>
        <ol className="list-decimal ml-6 space-y-1">
          <li>Check all API endpoints show "✅ Working"</li>
          <li>If you see errors, read the error messages above</li>
          <li>If everything is working here, the main analytics page should work too</li>
          <li>Try opening: <a href="/analytics" className="text-blue-600 underline">/analytics</a></li>
        </ol>
      </div>
    </div>
  );
}
