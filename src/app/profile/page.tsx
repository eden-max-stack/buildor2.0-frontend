"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
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
} from "lucide-react";
import {
  ProfileProps,
  TabName,
  SolvedQuestion,
  DifficultyLevel,
} from "./models";
import { mockProfileData } from "./mockData";
import { redirect } from "next/navigation";

/**
 * Profile Component
 *
 * Main profile display component with three tabs:
 * - Overview: Shows contribution graph, pinned portfolio, and recent questions
 * - Questions Solved: Detailed list of all solved coding problems
 * - Portfolio: Extended portfolio with professor feedback and academic info
 */

export default function Profile({
  leftProfileCard = mockProfileData.leftProfileCard,
  contributionGrid = mockProfileData.contributionGrid,
  solvedQuestions = mockProfileData.solvedQuestions,
  professorFeedback = mockProfileData.professorFeedback,
  academicInfo = mockProfileData.academicInfo,
  // portfolioProjects = mockProfileData.portfolioProjects,
  currentProject = mockProfileData.currentProject,
  recentAchievement = mockProfileData.recentAchievement,
  externalLinks = mockProfileData.externalLinks,
  // statistics = mockProfileData.statistics,
}: Partial<ProfileProps> = {}) {
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const renderContent = () => {
    switch (activeTab) {
      case "Questions Solved":
        return <QuestionsTab questions={solvedQuestions} />;
      case "Portfolio":
        return (
          <PortfolioTab
            currentProject={currentProject}
            recentAchievement={recentAchievement}
            professorFeedback={professorFeedback}
            academicInfo={academicInfo}
            externalLinks={externalLinks}
          />
        );
      default:
        return (
          <OverviewTab
            contributionGrid={contributionGrid}
            solvedQuestions={solvedQuestions.slice(0, 4)}
            currentProject={currentProject}
            recentAchievement={recentAchievement}
          />
        );
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* --- LEFT SIDEBAR --- */}
            <div className="md:col-span-4 lg:col-span-3 space-y-6">
              <div className="flex flex-col items-start">
                <div className="relative group">
                  <div className="w-64 h-64 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 mb-4 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <User className="w-32 h-32 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {leftProfileCard?.fullName || "Profile"}
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                  @{leftProfileCard?.username}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {leftProfileCard?.profileDesc ||
                    "Full-stack enthusiast building scalable apps."}
                </p>

                <button
                  className="w-full mb-6 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-colors text-sm flex items-center justify-center gap-2"
                  onClick={() => redirect("/profile/settings")}
                >
                  <Settings className="w-4 h-4" /> Edit Profile
                </button>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 w-full">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Class of {leftProfileCard?.graduationYear || "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {leftProfileCard?.location || "Unknown"}
                  </div>
                  {leftProfileCard?.website && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      <a
                        href={leftProfileCard?.website}
                        className="hover:text-blue-500 truncate"
                      >
                        {leftProfileCard?.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    <a href="#" className="hover:text-blue-500">
                      github.com/{leftProfileCard?.username}
                    </a>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Top Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {leftProfileCard?.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* --- RIGHT CONTENT AREA --- */}
            <div className="md:col-span-8 lg:col-span-9">
              {/* Navigation Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto no-scrollbar">
                <nav className="flex space-x-8">
                  {(
                    ["Overview", "Questions Solved", "Portfolio"] as TabName[]
                  ).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${
                          activeTab === tab
                            ? "border-orange-500 text-gray-900 dark:text-white"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300"
                        }
                      `}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Dynamic Content */}
              <div className="min-h-[400px]">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// --- TAB 1: OVERVIEW ---
interface OverviewTabProps {
  contributionGrid: ProfileProps["contributionGrid"];
  solvedQuestions: SolvedQuestion[];
  currentProject?: ProfileProps["currentProject"];
  recentAchievement?: ProfileProps["recentAchievement"];
}

function OverviewTab({
  contributionGrid,
  solvedQuestions,
  currentProject,
  recentAchievement,
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
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Hi there! 👋
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              I`&apos;`m a passionate developer currently solving complex
              algorithmic challenges. I`&apos;`m working on innovative projects
              to grow my skills.
            </p>

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
}

function PortfolioTab({
  currentProject,
  recentAchievement,
  professorFeedback,
  academicInfo,
  externalLinks,
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
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Hi there! 👋
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                I`&apos;`m a passionate developer currently solving complex
                algorithmic challenges. I`&apos;`m working on innovative
                projects to sharpen my problem-solving skills.
              </p>

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
                    `&quot;`{fb.comment}`&quot;`
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
  const iconMap: Record<string, JSX.Element> = {
    GitHub: <Github className="w-4 h-4" />,
    LinkedIn: <Briefcase className="w-4 h-4" />,
    LeetCode: <Code className="w-4 h-4" />,
  };
  return iconMap[platform] || <LinkIcon className="w-4 h-4" />;
}
