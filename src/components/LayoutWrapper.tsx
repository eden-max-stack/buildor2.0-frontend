"use client";

import { Database, X } from "lucide-react";
import { ReactNode, useState } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const [showMockDataToast, setShowMockDataToast] = useState(true);
  return (
    <div>
      {/* <Navbar />
        <Sidebar /> */}

      <main className="flex-1 flex flex-col">{children}</main>

      {showMockDataToast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/50 shadow-2xl rounded-xl p-4 flex items-start gap-3 max-w-sm">
            {/* Icon */}
            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full shrink-0 mt-0.5">
              <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>

            {/* Text */}
            <div className="flex-1 pr-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Preview Environment
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                This application is currently running with mock data. Live
                database integration and backend services are pending
                deployment.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowMockDataToast(false)}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* ------------------------------ */}
    </div>
  );
};

export default LayoutWrapper;
