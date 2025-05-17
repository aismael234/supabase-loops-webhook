"use client";

import { useEffect, useState } from "react";

interface WebhookEntry {
  timestamp: string;
  payload: unknown;
  transformed: {
    email: string;
    userId: string;
    userType: string;
  };
}

export default function WebhookViewer() {
  const [history, setHistory] = useState<WebhookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/webhook/loops");
      const data = await response.json();
      setHistory(data.history);
    } catch (error) {
      console.error("Failed to fetch webhook history:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center font-mono text-sm text-gray-500">
        Loading webhook history...
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-mono font-semibold">Recent Requests</h2>
          <button
            onClick={fetchHistory}
            disabled={refreshing}
            className={`text-xs font-mono px-2 py-1 rounded border border-gray-200 dark:border-gray-700
              ${
                refreshing
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              }`}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
          Auto-refreshes every 5s
        </span>
      </div>

      {history.length === 0 ? (
        <div className="p-8 text-center">
          <div className="inline-block p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
            Waiting for incoming webhooks...
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((entry, index) => (
            <div
              key={entry.timestamp + index}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
                <span className="text-xs font-mono px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded">
                  POST
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-semibold text-gray-500 dark:text-gray-400">
                    Incoming Payload
                  </h3>
                  <pre className="text-xs font-mono bg-gray-100 dark:bg-gray-800/50 p-3 rounded-md overflow-auto max-h-[300px]">
                    {JSON.stringify(entry.payload, null, 2)}
                  </pre>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-semibold text-gray-500 dark:text-gray-400">
                    Transformed → Loops.so
                  </h3>
                  <pre className="text-xs font-mono bg-gray-100 dark:bg-gray-800/50 p-3 rounded-md overflow-auto max-h-[300px]">
                    {JSON.stringify(entry.transformed, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
