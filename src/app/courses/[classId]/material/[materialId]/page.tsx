"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
  ChevronLeft,
  PlayCircle,
  FileText,
  Code2,
  User,
  CheckCircle2,
  ExternalLink,
  TerminalSquare,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const API_BASE = "http://localhost:8000";

// --- Helper to safely format video URLs for iframes ---
function getSafeEmbedUrl(url: string) {
  if (!url) return "";

  // Auto-convert standard YouTube links to embed links
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Prevent the "Inception" bug: ensure it doesn't load a local relative path
  if (!url.startsWith("http")) {
    return `https://${url}`;
  }

  return url;
}

export default function MaterialView({
  params,
}: {
  params: Promise<{ courseId: string; materialId: string }>;
}) {
  // 1. Properly unwrap Next.js 15 params using React.use()
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.courseId;
  const materialId = unwrappedParams.materialId;

  const supabase = createClient();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterial = async () => {
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

        // 2. Fetch using the properly unwrapped materialId
        const res = await fetch(
          `${API_BASE}/api/classes/materials/${materialId}/view`,
          { headers },
        );
        if (res.ok) {
          setMaterial(await res.json());
        }
      } catch (err) {
        console.error("Failed to load material:", err);
      } finally {
        setLoading(false);
      }
    };

    if (materialId) fetchMaterial();
  }, [materialId, supabase]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!material) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] flex items-center justify-center">
          <p className="text-gray-500">Material not found.</p>
        </div>
      </Layout>
    );
  }

  const viewType = material.type; // "VIDEO", "ARTICLE", or "QUESTION"
  const isPdf = material.content_url?.toLowerCase().endsWith(".pdf");

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href={`/courses/${courseId}`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-blue transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to {material.className}
            </Link>

            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                viewType === "VIDEO"
                  ? "bg-brand-blue/10 text-brand-blue border-brand-blue/20"
                  : viewType === "ARTICLE"
                    ? "bg-brand-amber/10 text-brand-amber border-brand-amber/20"
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }`}
            >
              {viewType === "VIDEO" && <PlayCircle className="w-3.5 h-3.5" />}
              {viewType === "ARTICLE" && <FileText className="w-3.5 h-3.5" />}
              {viewType === "QUESTION" && <Code2 className="w-3.5 h-3.5" />}
              {viewType}
            </div>
          </div>

          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {material.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-blue" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {material.postedBy}
                </span>
              </div>
            </div>
          </div>

          {/* DYNAMIC CONTENT AREA */}

          {/* --- VIDEO VIEW --- */}
          {viewType === "VIDEO" && (
            <div className="animate-in fade-in duration-500 max-w-5xl mx-auto space-y-4">
              <div className="w-full aspect-video bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden relative">
                {material.content_url ? (
                  <iframe
                    // 3. Prevent Inception bug by passing the URL through the formatter
                    src={getSafeEmbedUrl(material.content_url)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    No video URL provided.
                  </div>
                )}
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
          )}

          {/* --- ARTICLE / PDF VIEW --- */}
          {viewType === "ARTICLE" && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
              {isPdf ? (
                <div className="w-full h-[800px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-sm bg-white dark:bg-gray-900">
                  <iframe
                    src={getSafeEmbedUrl(material.content_url)}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 sm:p-12 shadow-sm">
                  <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    {material.content_url?.startsWith("http") ? (
                      <a
                        href={material.content_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-blue flex items-center gap-2"
                      >
                        Read External Article{" "}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <p>{material.content_url || "No content provided."}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium shadow-sm">
                  <CheckCircle2 className="w-5 h-5" /> Mark Article as Read
                </button>
              </div>
            </div>
          )}

          {/* --- QUESTION / CHALLENGE VIEW --- */}
          {viewType === "QUESTION" && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12">
              <div className="bg-gradient-to-br from-brand-dark to-gray-900 rounded-3xl p-1 shadow-xl relative overflow-hidden">
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
                      {material.difficulty || "Medium"}
                    </span>
                    {material.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/sandbox/${material.question_id}`}
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-blue text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all hover:-translate-y-1 w-full sm:w-auto"
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
