"use client";

import Link from "next/link";
import Layout from "@/components/Layout";
import {
  ChevronLeft,
  PlayCircle,
  FileText,
  Code2,
  Clock,
  User,
  Play,
  Volume2,
  Settings,
  Maximize,
  CheckCircle2,
  ExternalLink,
  TerminalSquare,
} from "lucide-react";

// --- Mock Data ---
const materialData = {
  id: "mat-1",
  classId: "CS401",
  className: "Advanced Graph Algorithms",
  title: "Implementing Dijkstra's Algorithm with Priority Queues",
  postedBy: "Prof. Alan Turing",
  postedTime: "Oct 24, 2025 • 10:30 AM",

  // The type dictates the entire view layout: "Video" | "Article" | "Question"
  type: "Video" as const,

  // Video Specific
  duration: "45:20",
  transcript: [
    {
      time: "00:00",
      text: "Welcome back everyone. Today we are going to look at...",
    },
    {
      time: "02:15",
      text: "The core issue with standard BFS is that it doesn't account for edge weights.",
    },
    {
      time: "05:30",
      text: "This is where Edsger Dijkstra's brilliant insight comes into play.",
    },
    {
      time: "12:45",
      text: "Let's look at how we can implement this using a Min-Heap or Priority Queue.",
    },
    {
      time: "22:10",
      text: "Notice how the time complexity drops from O(V^2) down to O((V+E) log V).",
    },
  ],

  // Article Specific
  content: `
Dijkstra's algorithm allows us to find the shortest path between any two vertices of a graph.

It differs from the minimum spanning tree because the shortest distance between two vertices might not include all the vertices of the graph.

### How it works
1. Mark all vertices as unvisited initially.
2. Mark the initial node with current distance 0 and the rest with infinity.
3. For the current node, consider all of its unvisited neighbors and calculate their tentative distances through the current node.
4. Compare the newly calculated tentative distance to the current assigned value and assign the smaller one.
5. When we are done considering all of the unvisited neighbors of the current node, mark the current node as visited.

Using a **Priority Queue** (Min-Heap) is essential for optimizing the extraction of the minimum distance node.
  `,

  // Question Specific
  difficulty: "Hard",
  sandboxId: "q-401-05",
  tags: ["Graphs", "Shortest Path", "Heap"],
};

export default function MaterialView() {
  const viewType = materialData.type;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* 1. Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href={`/classes/${materialData.classId}`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-blue transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to {materialData.className}
            </Link>

            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                viewType === "Video"
                  ? "bg-brand-blue/10 text-brand-blue border-brand-blue/20"
                  : viewType === "Article"
                    ? "bg-brand-amber/10 text-brand-amber border-brand-amber/20"
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }`}
            >
              {viewType === "Video" && <PlayCircle className="w-3.5 h-3.5" />}
              {viewType === "Article" && <FileText className="w-3.5 h-3.5" />}
              {viewType === "Question" && <Code2 className="w-3.5 h-3.5" />}
              {viewType} Material
            </div>
          </div>

          {/* 2. Header Section */}
          <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {materialData.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-blue" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {materialData.postedBy}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {materialData.postedTime}
              </div>
              {viewType === "Video" && (
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-brand-red" />
                  {materialData.duration}
                </div>
              )}
            </div>
          </div>

          {/* 3. DYNAMIC CONTENT AREA */}

          {/* --- VIDEO VIEW --- */}
          {viewType === "Video" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              {/* Left: Video Player */}
              <div className="lg:col-span-2 space-y-4">
                <div className="w-full aspect-video bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden relative group cursor-pointer">
                  {/* Fake Video Thumbnail/Background */}
                  <img
                    src="https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=1200&h=675"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity"
                  />

                  {/* Big Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-blue/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current" />
                    </div>
                  </div>

                  {/* Fake Player Controls */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 flex items-center justify-between text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-4">
                      <Play className="w-5 h-5 hover:text-white" />
                      <Volume2 className="w-5 h-5 hover:text-white" />
                      <span className="text-sm font-mono">12:45 / 45:20</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Settings className="w-5 h-5 hover:text-white" />
                      <Maximize className="w-5 h-5 hover:text-white" />
                    </div>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-brand-blue/80 w-1/3" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark as completed?
                  </span>
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </button>
                </div>
              </div>

              {/* Right: Transcript Sidebar */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden flex flex-col h-[500px] lg:h-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/80">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-blue" />
                    Transcript
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {materialData.transcript.map((line, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 -mx-2 rounded-lg transition-colors"
                    >
                      <span className="text-xs font-mono text-brand-blue bg-brand-blue/10 px-1.5 py-0.5 rounded h-fit shrink-0 mt-0.5">
                        {line.time}
                      </span>
                      <p
                        className={`text-sm leading-relaxed ${idx === 3 ? "text-gray-900 dark:text-white font-medium" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200"}`}
                      >
                        {line.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- ARTICLE VIEW --- */}
          {viewType === "Article" && (
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 sm:p-12 shadow-sm animate-in fade-in duration-500">
              <article className="prose dark:prose-invert prose-blue max-w-none">
                {/* Note: In a real app, you would use a Markdown parser like 'react-markdown' here */}
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Dijkstra's algorithm allows us to find the shortest path
                  between any two vertices of a graph.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  It differs from the minimum spanning tree because the shortest
                  distance between two vertices might not include all the
                  vertices of the graph.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  How it works
                </h3>
                <ol className="space-y-3 text-gray-600 dark:text-gray-300 list-decimal pl-5">
                  <li>Mark all vertices as unvisited initially.</li>
                  <li>
                    Mark the initial node with current distance 0 and the rest
                    with infinity.
                  </li>
                  <li>
                    For the current node, consider all of its unvisited
                    neighbors and calculate their tentative distances through
                    the current node.
                  </li>
                  <li>
                    Compare the newly calculated tentative distance to the
                    current assigned value and assign the smaller one.
                  </li>
                  <li>
                    When we are done considering all of the unvisited neighbors
                    of the current node, mark the current node as visited.
                  </li>
                </ol>

                <div className="mt-8 p-4 bg-brand-blue/5 border-l-4 border-brand-blue rounded-r-lg text-brand-dark dark:text-blue-100 text-sm">
                  <strong>Pro Tip:</strong> Using a <code>Priority Queue</code>{" "}
                  (Min-Heap) is essential for optimizing the extraction of the
                  minimum distance node, bringing the time complexity down
                  dramatically.
                </div>
              </article>

              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50 flex justify-center">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium shadow-sm">
                  <CheckCircle2 className="w-5 h-5" /> Mark Article as Read
                </button>
              </div>
            </div>
          )}

          {/* --- QUESTION / CHALLENGE VIEW --- */}
          {viewType === "Question" && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12">
              <div className="bg-gradient-to-br from-brand-dark to-gray-900 rounded-3xl p-1 shadow-xl relative overflow-hidden">
                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-emerald-500 to-brand-amber opacity-30 blur-xl"></div>

                <div className="bg-white dark:bg-gray-900 rounded-[1.3rem] p-8 sm:p-12 relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center justify-center mb-6">
                    <TerminalSquare className="w-10 h-10 text-brand-blue" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Ready to solve this challenge?
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 max-w-lg mb-8">
                    You will be redirected to the interactive Code Sandbox
                    environment to write, test, and submit your solution for
                    grading.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-red/10 text-brand-red border border-brand-red/20">
                      {materialData.difficulty}
                    </span>
                    {materialData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/sandbox?id=${materialData.sandboxId}`}
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-blue text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-1 w-full sm:w-auto"
                  >
                    Open in Sandbox
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
