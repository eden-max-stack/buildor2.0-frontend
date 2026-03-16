import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  FileText,
  ArrowRight,
  MoreHorizontal,
  PlayCircle,
} from "lucide-react";

// --- Mock Data ---
const recentClasses = [
  {
    id: 1,
    name: "Advanced Graph Algorithms",
    code: "CS401",
    progress: 75,
    color: "brand-blue",
  },
  {
    id: 2,
    name: "Dynamic Programming Masterclass",
    code: "CS302",
    progress: 40,
    color: "brand-amber",
  },
  {
    id: 3,
    name: "System Design Fundamentals",
    code: "SYS101",
    progress: 90,
    color: "emerald-500",
  },
];

const pendingTasks = [
  {
    id: 1,
    title: "Implement Dijkstra's Algorithm",
    class: "CS401",
    due: "Today",
    priority: "High",
  },
  {
    id: 2,
    title: "Review Knapsack Problem",
    class: "CS302",
    due: "Tomorrow",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Read: CAP Theorem",
    class: "SYS101",
    due: "In 3 days",
    priority: "Low",
  },
];

const recentMaterials = [
  {
    id: 1,
    title: "Graph Traversals (BFS/DFS)",
    type: "Video",
    time: "2 hours ago",
    class: "CS401",
    // Replace these URLs with your actual image paths
    image:
      "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=600&h=300",
  },
  {
    id: 2,
    title: "Memoization vs Tabulation",
    type: "Article",
    time: "5 hours ago",
    class: "CS302",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&h=300",
  },
  {
    id: 3,
    title: "Consistent Hashing Architecture",
    type: "PDF",
    time: "Yesterday",
    class: "SYS101",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=300",
  },
  {
    id: 4,
    title: "Topological Sort Deep Dive",
    type: "Video",
    time: "2 days ago",
    class: "CS401",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600&h=300",
  },
];

const solvedQuestions = [
  {
    id: 1,
    title: "Course Schedule II",
    difficulty: "Medium",
    class: "CS401",
    time: "10 mins ago",
  },
  {
    id: 2,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    class: "CS302",
    time: "2 hours ago",
  },
  {
    id: 3,
    title: "Alien Dictionary",
    difficulty: "Hard",
    class: "CS401",
    time: "1 day ago",
  },
];

export default function StudentDashboard() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, Alex
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 font-mono text-sm">
                <span className="text-brand-blue">user.status</span> ={" "}
                <span className="text-emerald-400">
                  &quot;ready_to_code&quot;
                </span>
                ;
              </p>
            </div>
            <Link
              href="/classes"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-dark dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-blue/50 dark:hover:border-brand-blue/50 transition-all text-sm font-medium"
            >
              View All Classes <ArrowRight className="w-4 h-4" />
            </Link>
          </header>

          {/* 1. Recently Visited Classes */}
          <section>
            <Link
              href="/classes"
              className="inline-flex items-center gap-3 mb-6 group"
            >
              <div className="p-2 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-lg group-hover:bg-brand-blue/20 transition-colors">
                <BookOpen className="w-5 h-5 text-brand-blue" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors flex items-center gap-2">
                Jump Back In
                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </h2>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentClasses.map((cls) => (
                <Link
                  href={`/classes/${cls.id}`}
                  key={cls.id}
                  className="group block"
                >
                  <div
                    className={`p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-${cls.color}/50 transition-all hover:shadow-lg relative overflow-hidden h-full`}
                  >
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-${cls.color} opacity-80`}
                    />
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                        {cls.code}
                      </span>
                      <MoreHorizontal className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                      {cls.name}
                    </h3>
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">
                          Progress
                        </span>
                        <span className="font-mono text-gray-700 dark:text-gray-300">
                          {cls.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`bg-${cls.color} h-1.5 rounded-full`}
                          style={{ width: `${cls.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 2. Recent Materials (Carousel) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/materials"
                className="inline-flex items-center gap-3 group"
              >
                <div className="p-2 bg-brand-red/10 dark:bg-brand-red/20 rounded-lg group-hover:bg-brand-red/20 transition-colors">
                  <FileText className="w-5 h-5 text-brand-red" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-red transition-colors flex items-center gap-2">
                  Continue Learning
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </h2>
              </Link>
            </div>

            {/* Carousel Container */}
            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 hide-scrollbar snap-x">
              {recentMaterials.map((material) => (
                <Link
                  href={`/classes/material/${material.id}`}
                  key={material.id}
                  className="min-w-[280px] sm:min-w-[320px] rounded-xl overflow-hidden group snap-start border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="h-40 relative bg-gray-200 dark:bg-gray-900 overflow-hidden">
                    <Image
                      src={material.image}
                      alt={material.title}
                      width={800}
                      height={400}
                      className="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    {/* Overlay badge */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium text-white shadow-sm">
                      {material.type === "Video" ? (
                        <PlayCircle className="w-3.5 h-3.5" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                      {material.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-brand-red transition-colors">
                      {material.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-mono">
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {material.class}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {material.time}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 3. Tasks & Submissions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Active Tasks (5 Cols) */}
            <section className="lg:col-span-5 flex flex-col bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/tasks"
                  className="inline-flex items-center gap-3 group"
                >
                  <div className="p-2 bg-brand-amber/10 dark:bg-brand-amber/20 rounded-lg group-hover:bg-brand-amber/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-brand-amber" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-amber transition-colors flex items-center gap-2">
                    Active Tasks
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </h2>
                </Link>
                <span className="text-xs font-mono text-brand-amber bg-brand-amber/10 px-2 py-1 rounded hidden sm:block">
                  tasks.pending()
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  >
                    <button className="mt-1 w-5 h-5 rounded border border-gray-400 dark:border-gray-500 flex items-center justify-center hover:border-brand-blue hover:bg-brand-blue/10 transition-colors" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-200 text-sm">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
                        <span>{task.class}</span>
                        <span>•</span>
                        <span
                          className={
                            task.due === "Today" ? "text-brand-red" : ""
                          }
                        >
                          {task.due}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Submissions (7 Cols) */}
            <section className="lg:col-span-7 flex flex-col bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
                <Link
                  href="/questions"
                  className="inline-flex items-center gap-3 group"
                >
                  <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                    <Code2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors flex items-center gap-2">
                    Recent Submissions
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </h2>
                </Link>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700/50 flex-1">
                {solvedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-200 text-sm line-clamp-1">
                          {q.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">
                            {q.class}
                          </span>
                          <span>•</span>
                          <span>{q.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          q.difficulty === "Easy"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : q.difficulty === "Medium"
                              ? "bg-brand-amber/10 text-brand-amber"
                              : "bg-brand-red/10 text-brand-red"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
