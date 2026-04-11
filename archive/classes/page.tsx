"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  Code2,
  Loader2,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const API_BASE = "http://localhost:8000";

const COLORS = ["brand-blue", "brand-amber", "emerald-500"];

interface MyClass {
  class_id: string;
  title: string;
  description: string;
  role: string;
  phases_count: number;
  students_count: number;
}

interface MyGoal {
  goal_id: string;
  title: string;
  target_date: string | null;
  class_id: string;
  class_title: string | null;
  total_items: number;
  completed_items: number;
}

export default function LearningDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [classes, setClasses] = useState<MyClass[]>([]);
  const [goals, setGoals] = useState<MyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const [classesRes, goalsRes] = await Promise.all([
        fetch(`${API_BASE}/api/classes/my-classes`, { headers }),
        fetch(`${API_BASE}/api/classes/my-goals?limit=10`, { headers }),
      ]);

      if (classesRes.ok) setClasses(await classesRes.json());
      if (goalsRes.ok) setGoals(await goalsRes.json());
    } catch (err) {
      console.error("Classes page fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter classes by tab
  const displayClasses =
    activeTab === "all"
      ? classes
      : activeTab === "student"
        ? classes.filter((c) => c.role === "student")
        : classes.filter((c) => c.role === "trainer");

  // Today's goals: goals with target_date today or overdue
  const todayGoals = goals.filter((g) => {
    if (!g.target_date) return false;
    const target = new Date(g.target_date);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return target.getTime() <= today.getTime();
  });

  // Calendar helpers
  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Dates that have goals
  const goalDates = new Set(
    goals.filter((g) => g.target_date).map((g) => g.target_date!),
  );

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else setCalMonth(calMonth + 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-dark dark:bg-brand-blue text-white flex items-center justify-center text-xl font-bold shadow-md">
              B
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Classes
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {classes.length} class{classes.length !== 1 ? "es" : ""} ·{" "}
                {goals.length} goal{goals.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar (Goals & Calendar) */}
            <aside className="w-full lg:w-80 shrink-0 space-y-6">
              {/* Today's Goals */}
              <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4">
                  Today&apos;s goals
                </h2>
                <div className="space-y-4">
                  {todayGoals.length > 0 ? (
                    todayGoals.map((goal) => (
                      <div
                        key={goal.goal_id}
                        className="flex items-start gap-3 group cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 mt-0.5 transition-colors ${
                            goal.completed_items >= goal.total_items &&
                            goal.total_items > 0
                              ? "text-brand-amber"
                              : "text-gray-300 dark:text-gray-600 group-hover:text-brand-amber"
                          }`}
                          fill="currentColor"
                        />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="underline decoration-gray-300 dark:decoration-gray-600 group-hover:decoration-brand-amber underline-offset-2">
                            {goal.title}
                          </span>
                          {goal.total_items > 0 && (
                            <span className="text-gray-400 dark:text-gray-500 ml-1 font-mono text-xs">
                              · {goal.completed_items}/{goal.total_items}
                            </span>
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No goals due today.
                    </p>
                  )}
                </div>
              </div>

              {/* Learning Plan (Calendar) */}
              <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4">
                  Learning plan
                </h2>

                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    {monthNames[calMonth]} {calYear}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevMonth}
                      className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-y-3 text-center text-xs">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <div
                      key={d}
                      className="text-gray-400 dark:text-gray-500 font-medium pb-2"
                    >
                      {d}
                    </div>
                  ))}

                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <div key={`empty-${i}`}></div>
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                    (day) => {
                      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const isToday =
                        day === now.getDate() &&
                        calMonth === now.getMonth() &&
                        calYear === now.getFullYear();
                      const hasGoal = goalDates.has(dateStr);

                      return (
                        <div
                          key={day}
                          className={`py-1 rounded-full cursor-pointer relative ${
                            isToday
                              ? "text-brand-blue dark:text-white font-bold"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {isToday && (
                            <span className="absolute inset-0 border-2 border-brand-blue rounded-full"></span>
                          )}
                          {day}
                          {hasGoal && (
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-amber rounded-full"></span>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </aside>

            {/* Right Main Content (Tabs & List) */}
            <main className="flex-1 space-y-6">
              {/* Pill Tabs */}
              <div className="flex items-center gap-2">
                {[
                  { key: "all", label: "All Classes" },
                  { key: "student", label: "Enrolled" },
                  { key: "trainer", label: "Teaching" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                        : "bg-transparent text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Course List */}
              <div className="space-y-4">
                {displayClasses.length > 0 ? (
                  displayClasses.map((cls, i) => {
                    const color = COLORS[i % COLORS.length];
                    return (
                      <div
                        key={cls.class_id}
                        className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Left: Course Details */}
                        <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700/50 pb-6 md:pb-0 md:pr-6">
                          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-2">
                            <Code2 className="w-4 h-4 text-brand-blue" />
                            {cls.role === "trainer" ? "Teaching" : "Enrolled"}
                          </div>
                          <Link href={`/classes/${cls.class_id}`}>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-brand-blue transition-colors mb-2">
                              {cls.title}
                            </h3>
                          </Link>

                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                            {cls.description || "No description available."}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-mono">
                            <span>{cls.phases_count} phases</span>
                            <span>•</span>
                            <span>{cls.students_count} students</span>
                          </div>
                        </div>

                        {/* Right: Action */}
                        <div className="w-full md:w-64 flex flex-col justify-center shrink-0">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                            {cls.role === "trainer"
                              ? "Manage Class"
                              : "Continue Learning"}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                            <BookOpen className="w-4 h-4" />
                            {cls.phases_count} phase
                            {cls.phases_count !== 1 ? "s" : ""} available
                          </div>

                          <div className="flex items-center gap-3">
                            <Link
                              href={`/classes/${cls.class_id}`}
                              className="flex-1 text-center bg-brand-blue text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                            >
                              {cls.role === "trainer" ? "Open" : "Resume"}
                            </Link>
                            <button className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                      No classes found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Browse available classes to enroll.
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
