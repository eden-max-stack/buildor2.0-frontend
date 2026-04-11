"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  ArrowRight,
  MoreHorizontal,
  Target,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const API_BASE = "http://localhost:8000";

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

interface MySubmission {
  submission_id: string;
  status: string;
  submitted_at: string;
  question_title: string | null;
  difficulty: string | null;
  tags: string[];
}

const COLORS = ["brand-blue", "brand-amber", "emerald-500"];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatTargetDate(dateStr: string | null): string {
  if (!dateStr) return "No date";
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `In ${diffDays} days`;
}

export default function StudentDashboard() {
  const [classes, setClasses] = useState<MyClass[]>([]);
  const [goals, setGoals] = useState<MyGoal[]>([]);
  const [submissions, setSubmissions] = useState<MySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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

      const [classesRes, goalsRes, subsRes] = await Promise.all([
        fetch(`${API_BASE}/api/classes/my-classes`, { headers }),
        fetch(`${API_BASE}/api/classes/my-goals?limit=5`, { headers }),
        fetch(`${API_BASE}/api/classes/my-submissions/recent?limit=3`, {
          headers,
        }),
      ]);

      if (classesRes.ok) setClasses(await classesRes.json());
      if (goalsRes.ok) setGoals(await goalsRes.json());
      if (subsRes.ok) setSubmissions(await subsRes.json());
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back
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

          {/* 1. My Classes */}
          <section>
            <Link
              href="/classes"
              className="inline-flex items-center gap-3 mb-6 group"
            >
              <div className="p-2 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-lg group-hover:bg-brand-blue/20 transition-colors">
                <BookOpen className="w-5 h-5 text-brand-blue" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors flex items-center gap-2">
                My Classes
                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </h2>
            </Link>

            {classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {classes.slice(0, 3).map((cls, i) => {
                  const color = COLORS[i % COLORS.length];
                  return (
                    <Link
                      href={`/classes/${cls.class_id}`}
                      key={cls.class_id}
                      className="group block"
                    >
                      <div
                        className={`p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-${color}/50 transition-all hover:shadow-lg relative overflow-hidden h-full`}
                      >
                        <div
                          className={`absolute top-0 left-0 w-full h-1 bg-${color} opacity-80`}
                        />
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                            {cls.role === "trainer" ? "Trainer" : "Student"}
                          </span>
                          <MoreHorizontal className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
                        </div>
                        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                          {cls.title}
                        </h3>
                        <div className="mt-auto flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-mono">
                          <span>{cls.phases_count} phases</span>
                          <span>•</span>
                          <span>{cls.students_count} students</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No classes yet. Browse available classes to get started.
                </p>
              </div>
            )}
          </section>

          {/* 2. Goals & Submissions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Learning Goals (5 Cols) */}
            <section className="lg:col-span-5 flex flex-col bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-3">
                  <div className="p-2 bg-brand-amber/10 dark:bg-brand-amber/20 rounded-lg">
                    <Target className="w-5 h-5 text-brand-amber" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Learning Goals
                  </h2>
                </div>
                <span className="text-xs font-mono text-brand-amber bg-brand-amber/10 px-2 py-1 rounded hidden sm:block">
                  top 5
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {goals.length > 0 ? (
                  goals.map((goal) => (
                    <div
                      key={goal.goal_id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                      <div className="mt-1 shrink-0">
                        {goal.completed_items >= goal.total_items &&
                        goal.total_items > 0 ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <div className="w-5 h-5 rounded border border-gray-400 dark:border-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-200 text-sm">
                          {goal.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
                          <span>{goal.class_title || "Class"}</span>
                          <span>•</span>
                          <span
                            className={
                              formatTargetDate(goal.target_date) === "Today" ||
                              formatTargetDate(goal.target_date) === "Overdue"
                                ? "text-brand-red"
                                : ""
                            }
                          >
                            {formatTargetDate(goal.target_date)}
                          </span>
                          {goal.total_items > 0 && (
                            <>
                              <span>•</span>
                              <span>
                                {goal.completed_items}/{goal.total_items}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No learning goals set yet.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Recent Submissions (7 Cols) */}
            <section className="lg:col-span-7 flex flex-col bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
                <div className="inline-flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg">
                    <Code2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Submissions
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700/50 flex-1">
                {submissions.length > 0 ? (
                  submissions.map((s) => (
                    <div
                      key={s.submission_id}
                      className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-200 text-sm line-clamp-1">
                            {s.question_title || "Untitled Question"}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span className="font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">
                              {s.status}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeAgo(s.submitted_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pl-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            s.difficulty === "Easy"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : s.difficulty === "Medium"
                                ? "bg-brand-amber/10 text-brand-amber"
                                : s.difficulty === "Hard"
                                  ? "bg-brand-red/10 text-brand-red"
                                  : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {s.difficulty || "N/A"}
                        </span>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Code2 className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No submissions yet. Start solving problems!
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
