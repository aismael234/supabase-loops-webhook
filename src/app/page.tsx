import WebhookViewer from "./components/WebhookViewer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold font-mono mb-2">Webhook Debug Console</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            Monitoring Supabase → Loops.so webhook transformations
          </p>
        </header>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <WebhookViewer />
        </div>

        <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400 font-mono">
          <p>Endpoint: POST /api/webhook/loops</p>
        </footer>
      </div>
    </div>
  );
}
