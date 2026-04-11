"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
  Search,
  Filter,
  BookOpen,
  Users,
  ArrowRight,
  Code2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ClassItem {
  class_id: string;
  title: string;
  description: string;
  trainer_id: string;
  trainer_name: string;
  phases_count: number;
  students_count: number;
}

export default function BrowseClasses() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchClasses = async () => {
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
        const response = await fetch(
          "http://localhost:8000/api/classes/browse",
          {
            method: "GET",
            headers,
          },
        );
        const data = await response.json();
        setClasses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load classes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-gray-900 dark:text-gray-200 transition-colors flex flex-col md:flex-row">
        {/* LEFT COLUMN: Sticky Filters */}
        <aside className="w-full md:w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1321] h-auto md:h-screen sticky top-0 p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-brand-blue/10 rounded-lg">
              <Filter size={18} className="text-brand-blue" />
            </div>
            <h2 className="font-bold text-lg dark:text-white">Filters</h2>
          </div>

          <div className="space-y-8">
            {/* Search Box */}
            <div>
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 block">
                class.search()
              </label>
              <div className="relative group">
                <Search
                  className="absolute left-3 top-3 text-gray-500 group-focus-within:text-brand-blue transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Find a course..."
                  className="w-full bg-gray-100 dark:bg-gray-900/50 border border-transparent dark:border-gray-700/50 pl-10 pr-4 py-2.5 rounded-lg focus:border-brand-blue/50 outline-none transition-all font-sans text-sm"
                />
              </div>
            </div>

            {/* Difficulty Toggle */}
            <div>
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 block">
                filter_by_level
              </label>
              <div className="space-y-3">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border border-gray-300 dark:border-gray-700 rounded checked:bg-brand-blue checked:border-brand-blue transition-all"
                      />
                      <CheckCircleIcon className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-brand-blue transition-colors">
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Results */}
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Course Catalog
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-3 font-mono text-sm">
              <span className="text-emerald-400">system.status</span> ={" "}
              <span className="text-brand-amber">
                &quot;browsing_available_modules&quot;
              </span>
              ;
            </p>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 dark:bg-gray-800/50 animate-pulse rounded-2xl border border-gray-700/30"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {classes.map((cls) => (
                <Link
                  href={`/courses/${cls.class_id}`}
                  key={cls.class_id}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-brand-blue/10 hover:border-brand-blue/30 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                    {/* Top Accent Bar */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-brand-blue/10 rounded-xl">
                        <Code2 size={22} className="text-brand-blue" />
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-mono py-1 px-2 bg-emerald-500/10 text-emerald-500 rounded-md border border-emerald-500/20">
                          OPEN_ENROLLMENT
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors mb-1">
                      {cls.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                      by {cls.trainer_name || "Unknown"}
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-8 flex-1">
                      {cls.description ||
                        "Learn core principles and advanced techniques in this comprehensive module."}
                    </p>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-700/50">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
                          <Layers size={14} className="text-brand-amber" />
                          {cls.phases_count} PHASES
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
                          <Users size={14} className="text-brand-blue" />
                          {cls.students_count} ENROLLED
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-brand-blue text-sm font-bold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        View <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

// Helper for the custom checkbox
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
