'use client'

import { useEffect } from 'react'
import { AlertCircle, Database, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  // Check if this is a database error
  const isDatabaseError = error.message?.includes('Tenant') ||
                         error.message?.includes('database') ||
                         error.message?.includes('prisma')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 p-4">
              {isDatabaseError ? (
                <Database className="w-8 h-8 text-red-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {isDatabaseError ? 'Database Connection Error' : 'Something went wrong'}
          </h2>

          {/* Message */}
          <div className="space-y-4">
            {isDatabaseError ? (
              <>
                <p className="text-gray-600 text-center">
                  We&apos;re having trouble connecting to the database. This might be due to:
                </p>
                <ul className="text-sm text-gray-600 space-y-2 bg-gray-50 rounded-lg p-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Missing or incorrect database environment variables</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Database service is temporarily unavailable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Database migrations haven&apos;t been applied</span>
                  </li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="font-semibold text-blue-900 mb-2">For Developers:</p>
                  <p className="text-blue-800">
                    Check your <code className="bg-blue-100 px-1 py-0.5 rounded">POSTGRES_PRISMA_URL</code> and{' '}
                    <code className="bg-blue-100 px-1 py-0.5 rounded">POSTGRES_URL_NON_POOLING</code>{' '}
                    environment variables. See DATABASE_SETUP.md for details.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-600 text-center">
                An unexpected error occurred while loading the dashboard.
              </p>
            )}

            {error.digest && (
              <p className="text-xs text-gray-400 text-center font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <a
              href="/"
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
