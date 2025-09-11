'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-black mb-8 text-center">
        Welcome to Buildor
      </h1>

      <p className="text-lg text-gray-700 text-center max-w-2xl mb-12">
        Empower your development workflow with our interactive tools: a Coding Practice Platform, AI-powered Recommendation Engine, and a powerful Analytics Dashboard.
      </p>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-black">

        {/* Coding Practice Platform Card */}
        <div className="bg-white shadow rounded p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-4">🖥️ Coding Practice Platform</h2>
          <p className="text-gray-600 mb-4">
            Write and test your JavaScript code in a fully-featured Monaco editor with instant output preview.
          </p>
          <Link href="/coding-practice-platform" className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Explore Coding Practice
          </Link>
        </div>

        {/* Recommendation Engine Card */}
        <div className="bg-white shadow rounded p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-4">🤖 Recommendation Engine</h2>
          <p className="text-gray-600 mb-4">
            Interact with our AI assistant to get intelligent recommendations and insights tailored to your needs.
          </p>
          <Link href="/recommendation-engine" className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Try the Recommendation Engine
          </Link>
        </div>

        {/* Dashboard Card */}
        <div className="bg-white shadow rounded p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-4">📊 Analytics Dashboard</h2>
          <p className="text-gray-600 mb-4">
            Monitor active users, system health, and recent activities in a clean, easy-to-use dashboard interface.
          </p>
          <Link href="/dashboard" className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Dashboard
          </Link>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-center">
        © 2023 Buildor. All rights reserved.
      </footer>

    </div>
  );
}
