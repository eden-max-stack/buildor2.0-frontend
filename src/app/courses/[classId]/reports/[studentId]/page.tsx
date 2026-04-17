"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  BrainCircuit,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { createClient } from "@/lib/supabase/client";

const API_BASE = "http://localhost:8000";

export default function StudentReportPage() {
  const params = useParams();
  const classId = params?.classId as string;
  const studentId = params?.studentId as string;
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      try {
        const res = await fetch(
          `${API_BASE}/classes/${classId}/reports/${studentId}`,
          {
            headers: { Authorization: `Bearer ${session?.access_token}` },
          },
        );
        if (res.ok) {
          setReportData(await res.json());
        }
      } catch (err) {
        console.error("Failed to load report", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [classId, studentId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" />
      </div>
    );
  if (!reportData)
    return <div className="p-8 text-center">Failed to load report.</div>;

  // Process data for charts
  const radarData = reportData.skills.map((s: any) => ({
    subject: s.tag_name,
    score: s.score,
    fullMark: 1000,
  }));

  const telemetryData = reportData.telemetry.map((t: any) => {
    const question =
      reportData.submissions.find((s: any) => s.question_id === t.question_id)
        ?.questions?.title || "Unknown Q";
    return { name: question.substring(0, 10) + "...", hints: t.hints_used };
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <Link
            href={`/courses/${classId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-blue"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Class
          </Link>

          <h1 className="text-3xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4">
            Student Analytics Report
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Radar Chart: Skill Profile */}
            <div className="bg-white dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BrainCircuit className="text-brand-blue" /> Skill Breakdown
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={radarData}
                  >
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 1000]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Student"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.4}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "white",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Hint Dependency */}
            <div className="bg-white dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="text-brand-amber" /> Hint Dependency
                (Last 5)
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={telemetryData.slice(0, 5)}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "#9CA3AF" }} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: "#374151", opacity: 0.2 }}
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="hints" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Submission History & Feedback */}
          <div className="bg-white dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <h3 className="font-bold mb-6">Recent Submissions</h3>
            <div className="space-y-4">
              {reportData.submissions.map((sub: any) => (
                <div
                  key={sub.submission_id}
                  className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{sub.questions?.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(sub.submitted_at).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded font-bold ${sub.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  {sub.submission_feedback &&
                    sub.submission_feedback.length > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 flex gap-3">
                        <MessageSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-brand-blue mb-1">
                            Trainer Feedback
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            "{sub.submission_feedback[0].content}"
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
