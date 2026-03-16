"use client";

import { useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  MoreHorizontal,
  CheckCircle2,
  FileText,
  Code2,
} from "lucide-react";

// --- TYPES ---
interface ClassItem {
  id: string;
  org: string;
  name: string;
  progress: number;
  color: string;
  action: string;
  estCompletion?: string; // Optional (only on active)
  completedDate?: string; // Optional (only on completed)
  grade?: string; // Optional (only on completed)
  currentModule?: {
    // Optional (only on active)
    title: string;
    type: string;
    duration: string;
  };
}

// --- Mock Data ---
const activeClasses: ClassItem[] = [
  {
    id: "CS401",
    org: "Massachusetts Institute of Technology",
    name: "Advanced Graph Algorithms",
    progress: 23,
    color: "brand-blue",
    estCompletion: "Aug 6, 2026",
    currentModule: {
      title: "Dijkstra's Intuition",
      type: "Video",
      duration: "8 minutes",
    },
    action: "Resume",
  },
  {
    id: "CS302",
    org: "Stanford University",
    name: "Dynamic Programming Masterclass",
    progress: 0,
    color: "brand-amber",
    estCompletion: "Jun 21, 2026",
    currentModule: {
      title: "1.0 Promo Video",
      type: "Video",
      duration: "1 minute",
    },
    action: "Get started",
  },
  {
    id: "SYS101",
    org: "Carnegie Mellon University",
    name: "System Design Fundamentals",
    progress: 85,
    color: "emerald-500",
    estCompletion: "Apr 12, 2026",
    currentModule: {
      title: "CAP Theorem Trade-offs",
      type: "Reading",
      duration: "15 minutes",
    },
    action: "Resume",
  },
];

const completedClasses: ClassItem[] = [
  {
    id: "CS201",
    org: "UC Berkeley",
    name: "Data Structures Foundations",
    progress: 100,
    color: "gray-500",
    completedDate: "Dec 15, 2025",
    grade: "98% (A+)",
    action: "Review",
  },
];

export default function LearningDashboard() {
  const [activeTab, setActiveTab] = useState("in-progress");

  const displayClasses =
    activeTab === "in-progress" ? activeClasses : completedClasses;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-dark dark:bg-brand-blue text-white flex items-center justify-center text-xl font-bold shadow-md">
              A
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Good morning, Alex
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Need help?{" "}
                <button className="text-brand-blue font-medium hover:underline">
                  Set your goal
                </button>
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar (Goals & Calendar) */}
            <aside className="w-full lg:w-80 shrink-0 space-y-6">
              {/* Today's Goals */}
              <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4">
                  Today&quot;s goals
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <Star
                      className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-0.5 group-hover:text-brand-amber transition-colors"
                      fill="currentColor"
                    />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="underline decoration-gray-300 dark:decoration-gray-600 group-hover:decoration-brand-amber underline-offset-2">
                        Complete any 3 learning items
                      </span>
                      <span className="text-gray-400 dark:text-gray-500 ml-1 font-mono text-xs">
                        · 0/3
                      </span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <Star
                      className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-0.5 group-hover:text-brand-amber transition-colors"
                      fill="currentColor"
                    />
                    <p className="text-sm text-gray-700 dark:text-gray-300 underline decoration-transparent group-hover:decoration-brand-amber underline-offset-2 transition-colors">
                      Complete a module
                    </p>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <Star
                      className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-0.5 group-hover:text-brand-amber transition-colors"
                      fill="currentColor"
                    />
                    <p className="text-sm text-gray-700 dark:text-gray-300 underline decoration-transparent group-hover:decoration-brand-amber underline-offset-2 transition-colors">
                      Complete a graded assessment
                    </p>
                  </div>
                </div>
              </div>

              {/* Learning Plan (Calendar) */}
              <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4">
                  Learning plan
                </h2>

                {/* Day toggles */}
                <div className="flex gap-2 mb-6">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-brand-blue hover:text-brand-blue cursor-pointer transition-colors"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    March 2026
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid (Hardcoded for Mar 2026 to match reference) */}
                <div className="grid grid-cols-7 gap-y-3 text-center text-xs">
                  <div className="text-gray-400 dark:text-gray-500 font-medium pb-2">
                    Mo
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 font-medium pb-2">
                    Tu
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 font-medium pb-2">
                    We
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 font-medium pb-2">
                    Th
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 font-medium pb-2">
                    Fr
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 font-medium pb-2">
                    Sa
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 font-medium pb-2">
                    Su
                  </div>

                  {/* Empty slots for spacing */}
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>

                  {/* Days */}
                  <div className="text-gray-700 dark:text-gray-300 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer">
                    1
                  </div>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((day) => (
                    <div
                      key={day}
                      className="text-gray-700 dark:text-gray-300 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
                    >
                      {day}
                    </div>
                  ))}
                  {/* Current Day Highlight */}
                  <div className="relative text-brand-blue dark:text-white font-bold py-1 flex items-center justify-center">
                    <span className="absolute inset-0 border-2 border-brand-blue rounded-full"></span>
                    15
                  </div>
                  {[
                    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                    31,
                  ].map((day) => (
                    <div
                      key={day}
                      className="text-gray-700 dark:text-gray-300 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Main Content (Tabs & List) */}
            <main className="flex-1 space-y-6">
              {/* Pill Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("in-progress")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "in-progress"
                      ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                      : "bg-transparent text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-gray-400"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "completed"
                      ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                      : "bg-transparent text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-gray-400"
                  }`}
                >
                  Completed
                </button>
              </div>

              {/* Course List */}
              <div className="space-y-4">
                {displayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Left: Course Details */}
                    <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700/50 pb-6 md:pb-0 md:pr-6">
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-2">
                        <Code2 className="w-4 h-4 text-brand-blue" />
                        {cls.org}
                      </div>
                      <Link href={`/classes/${cls.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-brand-blue transition-colors mb-2">
                          {cls.name}
                        </h3>
                      </Link>

                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>Course</span>
                        <span>•</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {cls.progress}% complete
                        </span>
                        <span>•</span>
                        {activeTab === "in-progress" ? (
                          <span>Estimated completion: {cls.estCompletion}</span>
                        ) : (
                          <span>Completed: {cls.completedDate}</span>
                        )}
                      </div>

                      {/* Thick Progress Bar (Coursera Style) */}
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 max-w-sm">
                        <div
                          className={`bg-${cls.color} h-2.5 rounded-full`}
                          style={{ width: `${cls.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Right: Next Action */}
                    <div className="w-full md:w-64 flex flex-col justify-center shrink-0">
                      {activeTab === "in-progress" ? (
                        <>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 text-sm">
                            {cls.currentModule?.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                            {cls.currentModule?.type === "Video" ? (
                              <PlayCircle className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                            {cls.currentModule?.type} (
                            {cls.currentModule?.duration})
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                            Course Completed
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-emerald-500 mb-4 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Grade: {cls.grade}
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/classes/${cls.id}`}
                          className="flex-1 text-center bg-brand-blue text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                        >
                          {cls.action}
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
