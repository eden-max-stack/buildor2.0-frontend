"use client";

import React, { useState, useEffect } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  MapPin,
  Link as LinkIcon,
  Github,
  Settings,
  BookOpen,
  Trophy,
  Code,
  ExternalLink,
  Search,
  Filter,
  Clock,
  Cpu,
  GraduationCap,
  MessageSquare,
  Briefcase,
  Loader2,
  PlusCircle,
  CheckCircle2,
  Mail,
  Users,
  Star,
  UserPlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DifficultyLevel, ProfileProps, SolvedQuestion } from "./models";

const API_BASE = "http://localhost:8000";

// --- 1. MAIN SMART WRAPPER ---
export default function UnifiedProfilePage() {
  const params = useParams();
  const usernameParam = params?.username as string;
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<"STUDENT" | "TRAINER" | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/auth/login");
          return;
        }

        const headers = { Authorization: `Bearer ${session.access_token}` };

        // 2. UPDATED: The magic logic. If the URL is /profile/@me OR their own user ID, they are the owner!
        const isMe =
          usernameParam === "%40me" ||
          usernameParam === "@me" ||
          usernameParam === session.user.id;
        setIsOwner(isMe);

        if (isMe) {
          // Fetch Private Profile
          const meRes = await fetch(`${API_BASE}/api/profile/me`, { headers });
          if (!meRes.ok) throw new Error("Failed to determine role");
          const meData = await meRes.json();
          const userRole = meData.role === "TRAINER" ? "TRAINER" : "STUDENT";
          setRole(userRole);

          const profileEndpoint =
            userRole === "TRAINER"
              ? "/api/profile/trainer"
              : "/api/profile/student";
          const profileRes = await fetch(`${API_BASE}${profileEndpoint}`, {
            headers,
          });
          const data = await profileRes.json();

          if (userRole === "TRAINER") {
            const classesRes = await fetch(`${API_BASE}/api/classes`, {
              headers,
            });
            data.classes = classesRes.ok ? await classesRes.json() : [];
          }
          setProfileData(data);
        } else {
          // Fetch Public Profile (Viewing someone else)
          // 3. UPDATED: Pass the usernameParam to the API
          const publicTrainerRes = await fetch(
            `${API_BASE}/api/profile/trainer/${usernameParam}`,
          );
          if (publicTrainerRes.ok) {
            setRole("TRAINER");
            setProfileData(await publicTrainerRes.json());
          } else {
            const publicStudentRes = await fetch(
              `${API_BASE}/api/profile/student/${usernameParam}`,
            );
            if (publicStudentRes.ok) {
              setRole("STUDENT");
              setProfileData(await publicStudentRes.json());
            } else {
              throw new Error("User not found");
            }
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (usernameParam) loadProfile();
  }, [usernameParam, router, supabase]);

  if (loading)
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  if (error || !profileData)
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          {error || "Could not load profile."}
        </div>
      </Layout>
    );

  return role === "TRAINER" ? (
    <TrainerProfileView data={profileData} isOwner={isOwner} router={router} />
  ) : (
    <StudentProfileView data={profileData} isOwner={isOwner} router={router} />
  );
}

// --- 2. TRAINER VIEW (LinkedIn Style Hero + Tabs) ---
function TrainerProfileView({
  data,
  isOwner,
  router,
}: {
  data: any;
  isOwner: boolean;
  router: any;
}) {
  const [activeTab, setActiveTab] = useState("My Classes");
  const tabs = ["My Classes", "About Me", "Credentials", "Availability"];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* HERO BANNER */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-32 md:h-48 bg-gradient-to-r from-brand-dark via-blue-900 to-gray-900 relative">
              <div className="absolute inset-0 opacity-10 font-mono text-9xl -top-10 -right-10 pointer-events-none text-brand-blue">
                {"{}"}
              </div>
            </div>

            <div className="px-6 md:px-10 pb-8 relative">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div className="-mt-16 md:-mt-20 shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-brand-blue to-blue-400 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                    {data.leftProfileCard?.fullName?.charAt(0) || "T"}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 md:pt-0">
                  {isOwner ? (
                    <button
                      onClick={() => router.push("/profile/settings")}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                      <Settings className="w-4 h-4" /> Edit Profile
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm">
                      <Mail className="w-5 h-5" /> Message
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  {data.leftProfileCard?.fullName}{" "}
                  <CheckCircle2 className="w-6 h-6 text-brand-blue" />
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg mt-1 font-medium">
                  {data.title}
                </p>
                <p className="text-sm font-mono text-gray-500 mt-2">
                  {data.workplace}
                </p>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto no-scrollbar flex justify-between items-end">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? "border-brand-blue text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
            {isOwner && activeTab === "My Classes" && (
              <button
                onClick={() => router.push("/instructor/create")}
                className="mb-2 flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" /> Create Class
              </button>
            )}
          </div>

          {/* TAB CONTENT */}
          <div className="min-h-[400px]">
            {activeTab === "My Classes" && (
              <TrainerClassesTab
                classes={data.classes || []}
                isOwner={isOwner}
              />
            )}
            {activeTab === "About Me" && (
              <TrainerAboutTab
                title={data.title}
                workplace={data.workplace}
                skills={data.leftProfileCard?.skills || []}
                attestations={data.attestations || []}
                reviews={data.reviews || []}
                averageRating={data.average_rating}
                ratingCount={data.rating_count || 0}
              />
            )}
            {activeTab === "Credentials" && (
              <TrainerCredentialsTab attestations={data.attestations || []} />
            )}
            {activeTab === "Availability" && (
              <TrainerAvailabilityTab
                availabilityText={data.availability_text || ""}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// --- 3. STUDENT VIEW (Dashboard Style Tabs) ---
function StudentProfileView({
  data,
  isOwner,
  router,
}: {
  data: any;
  isOwner: boolean;
  router: any;
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Questions Solved", "Portfolio"];

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-gray-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* LEFT SIDEBAR */}
            <div className="md:col-span-4 lg:col-span-3 space-y-6">
              <div className="w-64 h-64 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <User className="w-32 h-32 text-gray-400 dark:text-gray-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.leftProfileCard?.fullName}
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                @{data.leftProfileCard?.username}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {data.leftProfileCard?.profileDesc}
              </p>

              {/* DYNAMIC ACTION BUTTON */}
              {isOwner ? (
                <button
                  onClick={() => router.push("/profile/settings")}
                  className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-700 dark:text-gray-200 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <div className="w-full flex gap-3">
                  <button className="flex-1 py-2 px-4 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-600 flex items-center justify-center gap-2 text-sm">
                    <UserPlus className="w-4 h-4" /> Connect
                  </button>
                  <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* ... Rest of Student Sidebar (Location, GitHub, Skills) ... */}
              {/* (Paste your existing left-sidebar details here) */}
            </div>

            {/* RIGHT CONTENT AREA */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto flex justify-between items-end">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab ? "border-brand-blue text-gray-900 dark:text-white" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="min-h-[400px]">
                {activeTab === "Overview" && (
                  <OverviewTab
                    contributionGrid={data.contributionGrid}
                    solvedQuestions={data.solvedQuestions?.slice(0, 4) || []}
                    currentProject={data.currentProject}
                    recentAchievement={data.recentAchievement}
                    portfolioMd={data.portfolioMd}
                  />
                )}
                {activeTab === "Questions Solved" && (
                  <QuestionsTab questions={data.solvedQuestions || []} />
                )}
                {activeTab === "Portfolio" && (
                  <PortfolioTab
                    currentProject={data.currentProject}
                    recentAchievement={data.recentAchievement}
                    professorFeedback={data.professorFeedback || []}
                    academicInfo={data.academicInfo}
                    externalLinks={data.externalLinks || []}
                    portfolioMd={data.portfolioMd}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ---------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------

function TrainerAboutTab({
  title,
  workplace,
  skills,
  attestations,
  reviews,
  averageRating,
  ratingCount,
}: {
  title?: string;
  workplace?: string;
  skills: string[];
  attestations: any[];
  reviews: any[];
  averageRating?: number | null;
  ratingCount: number;
}) {
  const topAttestations = (
    Array.isArray(attestations) ? attestations : []
  ).slice(0, 3);
  const reviewsList = Array.isArray(reviews) ? reviews : [];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Instructor Overview
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {title || "Trainer"}
            </span>
            <span>at</span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {workplace || "Buildor"}
            </span>
          </div>
          {averageRating != null && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500 text-base">
                {"★".repeat(Math.round(averageRating))}
                {"☆".repeat(5 - Math.round(averageRating))}
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
              </span>
            </div>
          )}
          <div>
            This profile highlights your teaching credentials, areas of
            expertise, and availability.
          </div>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
          Areas of Expertise
        </h3>
        {skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No expertise added yet.
          </p>
        )}
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Recent Credentials
          </h3>
          <button
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            onClick={() => {
              const el = document.getElementById("profile-tab-Credentials");
              el?.click();
            }}
          >
            View all
          </button>
        </div>
        {topAttestations.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topAttestations.map((att: any) => (
              <div
                key={att.attestation_id || att.title}
                className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <div className="font-semibold text-sm text-gray-900 dark:text-white">
                  {att.title}
                </div>
                {att.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {att.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No credentials added yet.
          </p>
        )}
      </div>

      {/* Anonymous Feedback / Reviews */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Anonymous Feedback
          </h3>
        </div>
        {reviewsList.length > 0 ? (
          <div className="space-y-4">
            {reviewsList.map((review: any) => (
              <div
                key={review.review_id}
                className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  &quot;{review.content}&quot;
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No feedback received yet.
          </p>
        )}
      </div>
    </div>
  );
}

function TrainerCredentialsTab({ attestations }: { attestations: any[] }) {
  const items = Array.isArray(attestations) ? attestations : [];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Credentials
        </h2>
      </div>

      {items.length ? (
        <div className="space-y-4">
          {items.map((att: any) => (
            <div
              key={att.attestation_id || att.title}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {att.title}
              </h3>
              {att.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {att.description}
                </p>
              )}
              {att.attachment_url && (
                <div className="mt-4">
                  <a
                    href={att.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    View attachment <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-10 bg-white dark:bg-gray-900 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No credentials added yet.
          </p>
        </div>
      )}
    </div>
  );
}

function TrainerAvailabilityTab({
  availabilityText,
}: {
  availabilityText: string;
}) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Availability
      </h2>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
        {availabilityText ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {availabilityText}
          </p>
        ) : (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No availability info set yet. Update it from your profile
              settings.
            </p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Add office hours (e.g. Mon/Wed 7-9pm IST)
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Set response SLAs (e.g. replies within 24 hours)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- TAB 1: OVERVIEW ---
interface OverviewTabProps {
  contributionGrid: ProfileProps["contributionGrid"];
  solvedQuestions: SolvedQuestion[];
  currentProject?: ProfileProps["currentProject"];
  recentAchievement?: ProfileProps["recentAchievement"];
  portfolioMd?: string;
}

function OverviewTab({
  contributionGrid,
  solvedQuestions,
  currentProject,
  recentAchievement,
  portfolioMd,
}: OverviewTabProps) {
  const activityLevels = [
    "bg-gray-100 dark:bg-gray-800",
    "bg-green-200 dark:bg-green-900",
    "bg-green-300 dark:bg-green-700",
    "bg-green-400 dark:bg-green-600",
    "bg-green-500 dark:bg-green-500",
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Portfolio Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Pinned Portfolio
          </h2>
          <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Customize
          </button>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 text-sm font-mono">
            <span>README.md</span>
          </div>
          <article className="prose dark:prose-invert max-w-none">
            <div className="text-gray-800 dark:text-gray-100 text-sm mt-2">
              {portfolioMd || "No portfolio provided yet."}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {currentProject && (
                <div className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-500" /> Current Project
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {currentProject.description}
                  </p>
                </div>
              )}
              {recentAchievement && (
                <div className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" /> Recent
                    Achievement
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {recentAchievement.title}
                  </p>
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* Contribution Graph Section */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
          {contributionGrid.totalContributions.toLocaleString()} contributions
          in the last year
        </h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Graph Container */}
            <div className="grid grid-rows-7 grid-flow-col gap-1 w-fit">
              {contributionGrid.data.map((level, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm ${activityLevels[level]}`}
                  title={`Activity level: ${level}`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Learn more about how contribution counts are calculated
              </span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                {activityLevels.map((className, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 ${className} rounded-sm`}
                  ></div>
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Solved Questions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Recent Questions Solved
          </h2>
          <a
            href="#"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solvedQuestions.map((question) => (
            <div
              key={question.id}
              className="flex flex-col justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    {question.title}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColorClass(question.difficulty)}`}
                >
                  {question.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${getLanguageColor(question.lang)}`}
                  ></div>
                  {question.lang}
                </span>
                <span>Updated {question.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// --- TAB 2: QUESTIONS SOLVED (Detailed View) ---
interface QuestionsTabProps {
  questions: SolvedQuestion[];
}

function QuestionsTab({ questions }: QuestionsTabProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Solving History
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
            />
          </div>
          <button className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-900 hover:shadow-md transition-all"
          >
            {/* Top Row: Title, Difficulty, Language */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 p-2 rounded-lg ${getDifficultyBgClass(q.difficulty)}`}
                >
                  <Code
                    className={`w-5 h-5 ${getDifficultyTextClass(q.difficulty)}`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 cursor-pointer flex items-center gap-2">
                    {q.title}
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColorClass(q.difficulty)}`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                      {q.topic}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {q.lang}
                </span>
                <p className="text-xs text-gray-500">{q.date}</p>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800 mb-4" />

            {/* Bottom Row: Detailed Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {q.runtime}
                </span>
                <span className="text-xs">Runtime</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Cpu className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {q.memory}
                </span>
                <span className="text-xs">Memory</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {q.rank}
                </span>
                <span className="text-xs">Ranking</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] ${q.hintsUsed > 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}
                >
                  ?
                </div>
                <span
                  className={`font-medium ${q.hintsUsed > 0 ? "text-orange-600" : "text-gray-900 dark:text-gray-200"}`}
                >
                  {q.hintsUsed}
                </span>
                <span className="text-xs">Hints Used</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TAB 3: PORTFOLIO (Expanded View) ---
interface PortfolioTabProps {
  currentProject?: ProfileProps["currentProject"];
  recentAchievement?: ProfileProps["recentAchievement"];
  professorFeedback: ProfileProps["professorFeedback"];
  academicInfo?: ProfileProps["academicInfo"];
  externalLinks?: ProfileProps["externalLinks"];
  portfolioMd?: string;
}

function PortfolioTab({
  currentProject,
  recentAchievement,
  professorFeedback,
  academicInfo,
  externalLinks,
  portfolioMd,
}: PortfolioTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-300">
      {/* LEFT COLUMN: README & PROJECTS */}
      <div className="lg:col-span-2 space-y-8">
        {/* Readme Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Pinned Portfolio
            </h2>
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Customize
            </button>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 text-sm font-mono">
              <span>README.md</span>
            </div>
            <article className="prose dark:prose-invert max-w-none">
              <div className="text-gray-800 dark:text-gray-100 text-sm mt-2">
                {portfolioMd || "No portfolio provided yet."}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {currentProject && (
                  <div className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      <Code className="w-4 h-4 text-purple-500" /> Current
                      Project
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {currentProject.description}
                    </p>
                  </div>
                )}
                {recentAchievement && (
                  <div className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" /> Recent
                      Achievement
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {recentAchievement.title}
                    </p>
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>

        {/* Professor Feedback Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Professor Feedback
            </h2>
          </div>
          <div className="space-y-4">
            {professorFeedback.map((fb) => (
              <div
                key={fb.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-900 relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm">
                      {fb.prof
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {fb.prof}
                      </h4>
                      <p className="text-xs text-gray-500">{fb.course}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{fb.date}</span>
                </div>
                <div className="pl-12">
                  <p className="text-gray-600 dark:text-gray-300 text-sm italic">
                    &quot;{fb.comment}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: LINKS & METADATA */}
      <div className="space-y-6">
        {/* Class / Cohort Info */}
        {academicInfo && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Academic Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">University</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {academicInfo.university}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Degree</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {academicInfo.degree}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GPA</span>
                <span className="font-medium text-green-600">
                  {academicInfo.gpa}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expected Grad</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {academicInfo.expectedGraduation}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* External Links */}
        {externalLinks && externalLinks.length > 0 && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> On the Web
            </h3>
            <div className="space-y-3">
              {externalLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors group"
                >
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {getPlatformIcon(link.platform)}
                    <span className="text-sm">{link.platform}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- UTILITY FUNCTIONS ---

function getDifficultyColorClass(difficulty: DifficultyLevel): string {
  const colors = {
    Easy: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800",
    Medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    Hard: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800",
  };
  return colors[difficulty];
}

function getDifficultyBgClass(difficulty: DifficultyLevel): string {
  const colors = {
    Easy: "bg-green-50 dark:bg-green-900/30",
    Medium: "bg-yellow-50 dark:bg-yellow-900/30",
    Hard: "bg-red-50 dark:bg-red-900/30",
  };
  return colors[difficulty];
}

function getDifficultyTextClass(difficulty: DifficultyLevel): string {
  const colors = {
    Easy: "text-green-600 dark:text-green-400",
    Medium: "text-yellow-600 dark:text-yellow-400",
    Hard: "text-red-600 dark:text-red-400",
  };
  return colors[difficulty];
}

function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    Python: "bg-yellow-400",
    JavaScript: "bg-yellow-300",
    TypeScript: "bg-blue-500",
    Java: "bg-orange-500",
    "C++": "bg-pink-500",
    "C#": "bg-purple-500",
    Go: "bg-cyan-400",
    Rust: "bg-orange-600",
    Ruby: "bg-red-500",
    Swift: "bg-orange-400",
    Kotlin: "bg-purple-400",
  };
  return colors[lang] || "bg-gray-400";
}

function getPlatformIcon(platform: string) {
  const iconMap: Record<string, React.JSX.Element> = {
    GitHub: <Github className="w-4 h-4" />,
    LinkedIn: <Briefcase className="w-4 h-4" />,
    LeetCode: <Code className="w-4 h-4" />,
  };
  return iconMap[platform] || <LinkIcon className="w-4 h-4" />;
}

// --- TRAINER TAB: MY CLASSES ---
interface TrainerClassesTabProps {
  classes: any[];
  isOwner: boolean;
}

function TrainerClassesTab({ classes, isOwner }: TrainerClassesTabProps) {
  // 2. Destructure isOwner here
  if (!classes || classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg animate-in fade-in">
        <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          No classes yet
        </h3>

        {/* 3. Change empty state text based on ownership */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
          {isOwner
            ? "You haven't created any curriculum yet. Start building your first class to share your knowledge!"
            : "This instructor hasn't published any classes yet."}
        </p>

        {/* 4. Only show the Create button if it is the owner looking at their own profile */}
        {isOwner && (
          <button
            onClick={() => redirect("/instructor/create")} // Updated to your new instructor route!
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Create First Class
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
      {classes.map((cls) => (
        <Link
          key={cls.class_id}
          // 5. Dynamically route clicks: Owners go to manage/edit the course, visitors go to the unified preview page
          href={
            isOwner ? `/courses/${cls.class_id}` : `/courses/${cls.class_id}`
          }
          className="block border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
        >
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative p-4 flex items-end">
            <h3 className="text-xl font-bold text-white drop-shadow-md truncate">
              {cls.title}
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {cls.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {cls.phases_count || 0} Phases
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> {cls.students_count || 0} Enrolled
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
