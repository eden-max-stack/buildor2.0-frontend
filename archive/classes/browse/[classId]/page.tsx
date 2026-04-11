"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/Layout";
import {
  BookOpen,
  Code2,
  CheckCircle2,
  Users,
  PlayCircle,
  FileText,
  ExternalLink,
  ChevronRight,
  Circle,
  Star,
  Clock,
  Loader2,
  ClipboardList,
  Layers,
  ArrowLeft,
  UserPlus,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const API_BASE = "http://localhost:8000";

// --- Types ---
interface ClassDetail {
  class_id: string;
  title: string;
  description: string;
  created_at: string;
  trainer_id: string;
  trainer_name: string;
  students_count: number;
}

interface Phase {
  phase_id: string;
  title: string;
  description: string | null;
  order_index: number;
  materials: Material[];
}

interface Material {
  material_id: string;
  type: string;
  title: string;
  content_url: string | null;
  question_id: string | null;
  order_index: number;
}

interface Quiz {
  quiz_id: string;
  title: string;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  question_id: string;
  points: number;
  title: string | null;
  type: string | null;
  difficulty: string | null;
  tags: string[];
}

interface EnrollmentStatus {
  is_enrolled: boolean;
  is_trainer: boolean;
  enrolled_at: string | null;
}

const tabs = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "curriculum", label: "Curriculum", icon: Layers },
  { id: "quizzes", label: "Quizzes", icon: ClipboardList },
  { id: "trainer", label: "Trainer", icon: Users },
];

function getDifficultyColor(difficulty: string | null) {
  switch (difficulty) {
    case "Easy":
      return "bg-emerald-100 text-emerald-700 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-900/50 dark:border-emerald-700";
    case "Medium":
      return "bg-brand-amber text-brand-dark border-brand-amber dark:text-amber-200/70 dark:bg-amber-500/30 dark:border-amber-500";
    case "Hard":
      return "bg-brand-red text-white border-brand-red";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

export default function BrowseClassDetail() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.classId as string;
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [enrollment, setEnrollment] = useState<EnrollmentStatus | null>(null);
  const [trainerProfile, setTrainerProfile] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (classId) loadData();
  }, [classId]);

  const getHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    return headers;
  };

  const loadData = async () => {
    try {
      const headers = await getHeaders();

      const [detailRes, materialsRes, quizzesRes, enrollRes] = await Promise.all([
        fetch(`${API_BASE}/api/classes/${classId}/detail`, { headers }),
        fetch(`${API_BASE}/api/classes/${classId}/materials`, { headers }),
        fetch(`${API_BASE}/api/classes/${classId}/quizzes`, { headers }),
        fetch(`${API_BASE}/api/classes/${classId}/enrollment-status`, { headers }),
      ]);

      if (detailRes.ok) {
        const detail = await detailRes.json();
        setClassDetail(detail);

        // Fetch trainer profile
        if (detail.trainer_id) {
          try {
            const trainerRes = await fetch(`${API_BASE}/api/profiles/${detail.trainer_id}`, { headers });
            if (trainerRes.ok) {
              setTrainerProfile(await trainerRes.json());
            }
          } catch {
            // Trainer profile fetch is non-critical
          }
        }
      }
      if (materialsRes.ok) setPhases(await materialsRes.json());
      if (quizzesRes.ok) setQuizzes(await quizzesRes.json());
      if (enrollRes.ok) {
        const enrollData = await enrollRes.json();
        setEnrollment(enrollData);
        // Redirect enrolled users to the class hub
        if (enrollData.is_enrolled || enrollData.is_trainer) {
          router.replace(`/classes/${classId}`);
          return;
        }
      }
    } catch (err) {
      console.error("Browse class detail fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE}/api/classes/${classId}/enroll`, {
        method: "POST",
        headers,
      });

      if (res.ok) {
        setEnrollment({ is_enrolled: true, is_trainer: false, enrolled_at: new Date().toISOString() });
      } else {
        const err = await res.json();
        alert(err.detail || "Enrollment failed");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("Network error during enrollment");
    } finally {
      setEnrolling(false);
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

  if (!classDetail) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Class not found.</p>
        </div>
      </Layout>
    );
  }

  const totalMaterials = phases.reduce((sum, p) => sum + p.materials.length, 0);
  const totalQuizQuestions = quizzes.reduce((sum, q) => sum + q.questions.length, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back Link */}
          <Link
            href="/classes/browse"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>

          {/* Class Header Banner */}
          <div className="relative bg-gradient-to-r from-brand-dark to-blue-900 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 overflow-hidden shadow-xl border border-gray-800">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Code2 className="w-48 h-48 text-brand-blue" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <span className="inline-block px-3 py-1 bg-brand-blue/20 text-brand-blue border border-brand-blue/30 rounded-full text-xs font-mono mb-4">
                  COURSE PREVIEW
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {classDetail.title}
                </h1>

                <p className="text-gray-300 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                  {classDetail.description || "No description available."}
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    Trainer:
                    <span className="text-brand-blue font-medium">
                      {classDetail.trainer_name}
                    </span>
                  </span>
                  <span className="text-gray-600 dark:text-gray-500 hidden sm:inline">•</span>
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-500" />
                    {classDetail.students_count} Students
                  </span>
                  <span className="text-gray-600 dark:text-gray-500 hidden sm:inline">•</span>
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-gray-500" />
                    {phases.length} Phases
                  </span>
                  <span className="text-gray-600 dark:text-gray-500 hidden sm:inline">•</span>
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    {totalMaterials} Materials
                  </span>
                </div>
              </div>

              {/* Enroll Button */}
              <div className="shrink-0">
                {enrollment?.is_trainer ? (
                  <div className="flex items-center gap-2 px-6 py-3 bg-gray-700/50 text-gray-300 rounded-xl border border-gray-600">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">You are the trainer</span>
                  </div>
                ) : enrollment?.is_enrolled ? (
                  <button
                    onClick={() => router.push(`/classes/${classId}`)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors shadow-lg"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Enrolled — Go to Class
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="flex items-center gap-2 px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-brand-blue/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    {enrolling ? "Enrolling..." : "Enroll in Class"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 dark:border-gray-800">
            <div className="flex gap-8 px-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-brand-blue text-brand-blue dark:text-brand-blue"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="min-h-[400px]">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800/30 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 text-center">
                    <Layers className="w-6 h-6 text-brand-blue mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{phases.length}</p>
                    <p className="text-xs text-gray-500 font-mono">PHASES</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/30 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 text-center">
                    <BookOpen className="w-6 h-6 text-brand-amber mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMaterials}</p>
                    <p className="text-xs text-gray-500 font-mono">MATERIALS</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/30 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 text-center">
                    <ClipboardList className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.length}</p>
                    <p className="text-xs text-gray-500 font-mono">QUIZZES</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/30 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 text-center">
                    <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{classDetail.students_count}</p>
                    <p className="text-xs text-gray-500 font-mono">ENROLLED</p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white dark:bg-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">About this Class</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {classDetail.description || "No detailed description provided for this class."}
                  </p>
                </div>

                {/* Curriculum Preview */}
                {phases.length > 0 && (
                  <div className="bg-white dark:bg-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Curriculum Preview</h3>
                    <div className="space-y-3">
                      {phases.map((phase, idx) => (
                        <div
                          key={phase.phase_id}
                          className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-sm shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-gray-100">{phase.title}</p>
                            {phase.description && (
                              <p className="text-xs text-gray-500 mt-0.5">{phase.description}</p>
                            )}
                          </div>
                          <span className="text-xs font-mono text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {phase.materials.length} items
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CURRICULUM TAB */}
            {activeTab === "curriculum" && (
              <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {phases.length > 0 ? phases.map((phase) => (
                  <div
                    key={phase.phase_id}
                    className="bg-white dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden shadow-sm"
                  >
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {phase.title}
                      </h3>
                      <span className="text-xs font-mono text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {phase.materials.length} items
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {phase.materials.map((item) => {
                        const isVideo = item.type === "VIDEO";
                        const isQuestion = item.type === "QUESTION";
                        return (
                          <div
                            key={item.material_id}
                            className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="shrink-0">
                              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                            </div>
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <div
                                className={`p-2 rounded-lg shrink-0 w-fit ${isVideo ? "bg-brand-blue/10 text-brand-blue" : isQuestion ? "bg-brand-amber/10 text-brand-amber" : "bg-brand-red/10 text-brand-red"}`}
                              >
                                {isVideo && <PlayCircle className="w-4 h-4" />}
                                {isQuestion && <Code2 className="w-4 h-4" />}
                                {!isVideo && !isQuestion && <FileText className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {item.title}
                                </p>
                                <span className="text-xs text-gray-500">{item.type}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No curriculum published yet</p>
                  </div>
                )}
              </div>
            )}

            {/* QUIZZES TAB */}
            {activeTab === "quizzes" && (
              <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {quizzes.length > 0 ? quizzes.map((quiz) => (
                  <div
                    key={quiz.quiz_id}
                    className="bg-white dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden shadow-sm"
                  >
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-brand-blue" />
                        {quiz.title}
                      </h3>
                      <span className="text-xs font-mono text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {quiz.questions.map((q, idx) => (
                        <div
                          key={q.question_id}
                          className="px-6 py-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-mono text-gray-400 w-6">{idx + 1}</span>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {q.title || "Untitled Question"}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>{q.type || "DSA"}</span>
                                <span>•</span>
                                <span>{q.points} pts</span>
                                {q.tags && q.tags.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{q.tags.slice(0, 2).join(", ")}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border-2 ${getDifficultyColor(q.difficulty)}`}
                          >
                            {q.difficulty || "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No quizzes published yet</p>
                  </div>
                )}
              </div>
            )}

            {/* TRAINER TAB */}
            {activeTab === "trainer" && (
              <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-gray-800/30 rounded-xl p-8 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blue to-blue-400 flex items-center justify-center text-white text-3xl font-bold shadow-md shrink-0">
                      {classDetail.trainer_name
                        .split(" ")
                        .filter((n) => n.length > 0)
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-2xl font-bold text-brand-dark dark:text-white">
                        {classDetail.trainer_name}
                      </h3>
                      {trainerProfile ? (
                        <>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">
                            {trainerProfile.profile_description || "Instructor"}
                          </p>
                          {trainerProfile.location && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              📍 {trainerProfile.location}
                            </p>
                          )}
                          {trainerProfile.university && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              🎓 {trainerProfile.university}
                              {trainerProfile.department && ` — ${trainerProfile.department}`}
                            </p>
                          )}
                          {trainerProfile.github_username && (
                            <a
                              href={`https://github.com/${trainerProfile.github_username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-brand-blue hover:underline mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              GitHub: {trainerProfile.github_username}
                            </a>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                          Instructor
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional trainer stats */}
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-amber fill-brand-amber" />
                      Class Stats
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{classDetail.students_count}</p>
                        <p className="text-xs text-gray-500">Students</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{totalMaterials}</p>
                        <p className="text-xs text-gray-500">Materials</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{totalQuizQuestions}</p>
                        <p className="text-xs text-gray-500">Questions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Enrollment CTA (sticky) */}
          {!enrollment?.is_enrolled && !enrollment?.is_trainer && (
            <div className="sticky bottom-4 z-20">
              <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-2xl flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{classDetail.title}</p>
                  <p className="text-sm text-gray-500">{phases.length} phases · {totalMaterials} materials · {quizzes.length} quizzes</p>
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 shrink-0"
                >
                  {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
