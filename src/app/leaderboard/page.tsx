"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import {
  Trophy,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

// --- Mock Data ---
const classesFilter = [
  { id: "ALL", name: "All Shared Classes" },
  { id: "CS401", name: "Advanced Graph Algorithms" },
  { id: "CS302", name: "Dynamic Programming Masterclass" },
  { id: "SYS101", name: "System Design Fundamentals" },
];

const networkLeaderboard = [
  {
    id: "u1",
    rank: 1,
    name: "Alice Johnson",
    username: "alice_codes",
    score: 2450,
    solved: 210,
    sharedClasses: ["CS401", "CS302", "SYS101"],
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
    isMe: false,
    trend: "up",
  },
  {
    id: "me",
    rank: 2,
    name: "Alex (You)",
    username: "alex_dev",
    score: 2320,
    solved: 195,
    sharedClasses: ["CS401", "CS302", "SYS101"],
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100",
    isMe: true,
    trend: "up",
  },
  {
    id: "u2",
    rank: 3,
    name: "Bob Smith",
    username: "bob_builder",
    score: 2180,
    solved: 180,
    sharedClasses: ["CS401", "SYS101"],
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100",
    isMe: false,
    trend: "down",
  },
  {
    id: "u3",
    rank: 4,
    name: "Carol Williams",
    username: "carol_w",
    score: 1950,
    solved: 165,
    sharedClasses: ["CS302"],
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
    isMe: false,
    trend: "same",
  },
  {
    id: "u4",
    rank: 5,
    name: "David Brown",
    username: "dbrown99",
    score: 1840,
    solved: 150,
    sharedClasses: ["CS401", "CS302"],
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
    isMe: false,
    trend: "up",
  },
];

// --- Subcomponents ---

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up")
    return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
  if (trend === "down")
    return <ArrowDownRight className="w-4 h-4 text-brand-red" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
}

export default function Leaderboard() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // In a real app, you would filter the data here based on activeFilter and searchQuery
  const displayData = networkLeaderboard;

  const topThree = [
    displayData.find((u) => u.rank === 2), // Silver (Left)
    displayData.find((u) => u.rank === 1), // Gold (Center)
    displayData.find((u) => u.rank === 3), // Bronze (Right)
  ].filter(Boolean);

  const restOfBoard = displayData.filter((u) => u.rank > 3);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Trophy className="w-8 h-8 text-brand-amber" />
                Network Rankings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Compare your progress against friends based on shared classes.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-gray-500">Your Rank:</span>
              <span className="font-bold text-brand-blue">#2</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-gray-500">Top</span>
              <span className="font-bold text-emerald-500">5%</span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center z-20 relative">
            {/* Class Filter Dropdown (Custom styled select) */}
            <div className="relative w-full md:w-64 group">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-2.5 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
              >
                {classesFilter.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="w-4 h-4 text-gray-400 group-focus-within:text-brand-blue" />
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
              />
            </div>
          </div>

          {/* Podium (Top 3) */}
          <div className="bg-gradient-to-b from-white dark:from-gray-800/80 to-gray-50 dark:to-gray-900 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 shadow-sm overflow-hidden relative">
            {/* Decorative background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-amber/5 blur-3xl pointer-events-none" />

            <div className="flex items-end justify-center gap-2 sm:gap-6 h-64 relative z-10">
              {/* 2nd Place */}
              {topThree[0] && (
                <div className="flex flex-col items-center w-28 sm:w-36 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                  <div className="relative mb-3">
                    <Image
                      src={topThree[0].avatar}
                      alt={topThree[0].name}
                      height={80}
                      width={80}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-300 dark:border-gray-400 object-cover shadow-lg"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-300 dark:bg-gray-400 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 text-white font-bold text-xs shadow-sm">
                      2
                    </div>
                  </div>
                  <p
                    className={`font-bold text-sm sm:text-base text-center truncate w-full px-2 ${topThree[0].isMe ? "text-brand-blue" : "text-gray-900 dark:text-white"}`}
                  >
                    {topThree[0].isMe ? "You" : topThree[0].name.split(" ")[0]}
                  </p>
                  <p className="text-xs font-mono text-gray-500 mb-2">
                    {topThree[0].score} pts
                  </p>
                  <div className="w-full h-24 bg-gradient-to-t from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-t-lg border-t border-x border-gray-300 dark:border-gray-600 opacity-90" />
                </div>
              )}

              {/* 1st Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center w-32 sm:w-44 animate-in slide-in-from-bottom-12 duration-700 z-10">
                  <Trophy className="w-8 h-8 text-brand-amber mb-2 fill-brand-amber drop-shadow-md" />
                  <div className="relative mb-3">
                    <Image
                      src={topThree[1].avatar}
                      alt={topThree[1].name}
                      height={100}
                      width={100}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-brand-amber object-cover shadow-xl"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-amber rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 text-white font-bold text-xs shadow-sm">
                      1
                    </div>
                  </div>
                  <p
                    className={`font-bold text-base sm:text-lg text-center truncate w-full px-2 ${topThree[1].isMe ? "text-brand-blue" : "text-gray-900 dark:text-white"}`}
                  >
                    {topThree[1].isMe ? "You" : topThree[1].name.split(" ")[0]}
                  </p>
                  <p className="text-sm font-mono text-brand-amber font-bold mb-2">
                    {topThree[1].score} pts
                  </p>
                  <div className="w-full h-32 bg-gradient-to-t from-brand-amber/20 to-brand-amber/5 dark:from-brand-amber/30 dark:to-brand-amber/10 rounded-t-lg border-t border-x border-brand-amber/50 opacity-90" />
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center w-28 sm:w-36 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                  <div className="relative mb-3">
                    <Image
                      src={topThree[2].avatar}
                      alt={topThree[2].name}
                      height={80}
                      width={80}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-orange-400 dark:border-orange-500 object-cover shadow-lg"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-400 dark:bg-orange-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 text-white font-bold text-xs shadow-sm">
                      3
                    </div>
                  </div>
                  <p
                    className={`font-bold text-sm sm:text-base text-center truncate w-full px-2 ${topThree[2].isMe ? "text-brand-blue" : "text-gray-900 dark:text-white"}`}
                  >
                    {topThree[2].isMe ? "You" : topThree[2].name.split(" ")[0]}
                  </p>
                  <p className="text-xs font-mono text-gray-500 mb-2">
                    {topThree[2].score} pts
                  </p>
                  <div className="w-full h-16 bg-gradient-to-t from-orange-200/50 to-orange-100/50 dark:from-orange-900/40 dark:to-orange-800/40 rounded-t-lg border-t border-x border-orange-300 dark:border-orange-700 opacity-90" />
                </div>
              )}
            </div>
          </div>

          {/* List View (Rank 4+) */}
          <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700/50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="p-4 w-16 text-center">Rank</th>
                    <th className="p-4">Student</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-center">Solved</th>
                    <th className="p-4 hidden sm:table-cell">Shared Classes</th>
                    <th className="p-4 w-12 text-center">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {restOfBoard.map((user) => (
                    <tr
                      key={user.id}
                      className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/80 ${user.isMe ? "bg-brand-blue/5 dark:bg-brand-blue/10" : ""}`}
                    >
                      <td className="p-4 text-center font-mono text-gray-500 dark:text-gray-400 font-medium">
                        {user.rank}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            height={40}
                            width={40}
                            className="w-10 h-10 rounded-full object-cover bg-gray-100 dark:bg-gray-700"
                          />
                          <div>
                            <Link
                              href={`/student/${user.id}`}
                              className={`font-bold hover:underline ${user.isMe ? "text-brand-blue" : "text-gray-900 dark:text-white"}`}
                            >
                              {user.name}
                            </Link>
                            <p className="text-xs text-gray-500 font-mono">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center font-bold text-gray-900 dark:text-white">
                        {user.score.toLocaleString()}
                      </td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-300 font-medium">
                        {user.solved}
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {user.sharedClasses.map((cls) => (
                            <span
                              key={cls}
                              className={`text-[10px] px-2 py-0.5 rounded border ${
                                activeFilter === cls
                                  ? "bg-brand-blue border-brand-blue text-white"
                                  : "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center">
                          <TrendIcon trend={user.trend} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State / End of list */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/30 text-center border-t border-gray-200 dark:border-gray-700/50">
              <p className="text-sm text-gray-500">
                End of network leaderboard.{" "}
                <button className="text-brand-blue hover:underline font-medium">
                  Find more friends
                </button>{" "}
                to compete with!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
