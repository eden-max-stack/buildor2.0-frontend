"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const API_BASE = "http://localhost:8000";

interface McqOption {
  option_id: string;
  option_text: string;
  is_correct: boolean;
}

interface Question {
  question_id: string;
  title: string;
  description: string;
  difficulty: string | null;
  tags: string[];
  type: string;
  total_submissions: number;
  successful_submissions: number;
  mcq_options: McqOption[];
}

function getDifficultyColor(difficulty: string | null) {
  switch (difficulty) {
    case "Easy":
      return "bg-emerald-100 text-emerald-700 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-900/50 dark:border-emerald-700";
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-300 dark:text-amber-200/70 dark:bg-amber-500/30 dark:border-amber-500";
    case "Hard":
      return "bg-red-100 text-red-700 border-red-300 dark:text-red-300 dark:bg-red-900/50 dark:border-red-700";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

export default function McqPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const classId = params?.classId as string;
  const questionId = searchParams?.get("id");

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (questionId) fetchQuestion(questionId);
  }, [questionId]);

  const fetchQuestion = async (qid: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/questions/${qid}`);
      if (!res.ok) throw new Error("Failed to fetch question");
      const data = await res.json();
      if (!Array.isArray(data.mcq_options)) data.mcq_options = [];
      setQuestion(data);
    } catch (err) {
      console.error("Error fetching MCQ question:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOptionId || !question) return;
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const selectedOption = question.mcq_options.find(o => o.option_id === selectedOptionId);
      const isCorrect = selectedOption?.is_correct ?? false;

      const res = await fetch(`${API_BASE}/submissions/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          question_id: question.question_id,
          user_id: "00000000-0000-0000-0000-000000000000",
          code: selectedOptionId,
          language: "mcq",
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting MCQ:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setSubmitted(false);
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

  if (!question) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Question not found.</p>
        </div>
      </Layout>
    );
  }

  const selectedOption = question.mcq_options.find(o => o.option_id === selectedOptionId);
  const isCorrect = submitted && selectedOption?.is_correct;
  const acceptanceRate = question.total_submissions > 0
    ? Math.round((question.successful_submissions / question.total_submissions) * 100)
    : null;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Back Link */}
          <Link
            href={`/classes/${classId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Class
          </Link>

          {/* Question Header */}
          <div className="bg-white dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <ClipboardList className="w-5 h-5 text-brand-blue" />
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    MCQ
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border-2 ${getDifficultyColor(question.difficulty)}`}
                  >
                    {question.difficulty || "N/A"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {question.title}
                </h1>
              </div>
              {acceptanceRate !== null && (
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/50">
                  <BarChart3 className="w-4 h-4" />
                  {acceptanceRate}% acceptance
                </div>
              )}
            </div>

            {/* Tags */}
            {question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-brand-blue/10 text-brand-blue text-xs font-medium rounded-full border border-brand-blue/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="prose dark:prose-invert prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              <p>{question.description || "No description provided."}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Select your answer:
              </h3>
              {question.mcq_options.map((option, idx) => {
                const isSelected = selectedOptionId === option.option_id;
                const letter = String.fromCharCode(65 + idx);

                let optionStyles = "border-gray-200 dark:border-gray-700/50 hover:border-brand-blue/50 hover:bg-brand-blue/5";
                if (submitted) {
                  if (option.is_correct) {
                    optionStyles = "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600";
                  } else if (isSelected && !option.is_correct) {
                    optionStyles = "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-600";
                  } else {
                    optionStyles = "border-gray-200 dark:border-gray-700/50 opacity-50";
                  }
                } else if (isSelected) {
                  optionStyles = "border-brand-blue bg-brand-blue/10 dark:bg-brand-blue/20 ring-2 ring-brand-blue/30";
                }

                return (
                  <button
                    key={option.option_id}
                    onClick={() => !submitted && setSelectedOptionId(option.option_id)}
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${optionStyles} ${submitted ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        submitted && option.is_correct
                          ? "bg-emerald-500 text-white"
                          : submitted && isSelected && !option.is_correct
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-brand-blue text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {submitted && option.is_correct ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : submitted && isSelected && !option.is_correct ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        letter
                      )}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 pt-1">
                      {option.option_text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Result Banner */}
            {submitted && (
              <div
                className={`mt-6 p-4 rounded-xl border-2 flex items-center gap-3 ${
                  isCorrect
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 shrink-0" />
                )}
                <span className="font-bold text-sm">
                  {isCorrect ? "Correct! Well done." : "Incorrect. The correct answer is highlighted above."}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 mt-8">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedOptionId || isSubmitting}
                  className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-bold transition-colors"
                >
                  Try Again
                </button>
              )}
              <Link
                href={`/classes/${classId}`}
                className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-brand-blue transition-colors"
              >
                Back to Class
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
