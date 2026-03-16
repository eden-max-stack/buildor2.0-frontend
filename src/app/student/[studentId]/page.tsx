"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import {
  MapPin,
  Link as LinkIcon,
  Github,
  BookOpen,
  Trophy,
  Code,
  ExternalLink,
  GraduationCap,
  MessageSquare,
  Briefcase,
  UserPlus,
  Calendar,
  Code2,
} from "lucide-react";

// --- Mock Data ---
const studentInfo = {
  id: "u123",
  fullName: "Alice Johnson",
  username: "alice_codes",
  profileDesc:
    "CS Junior @ MIT | Competitive Programmer | Building scalable web apps.",
  graduationYear: "2026",
  location: "Cambridge, MA",
  website: "alicejohnson.dev",
  github: "alice_j",
  skills: ["Python", "C++", "React", "Node.js", "System Design"],
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
};

const contributionData = {
  total: 1245,
  grid: Array.from({ length: 365 }, () => Math.floor(Math.random() * 5)),
};

const academicInfo = {
  university: "Massachusetts Institute of Technology",
  degree: "B.S. Computer Science",
  gpa: "3.9/4.0",
  expectedGraduation: "Spring 2026",
};

const externalLinks = [
  { id: 1, platform: "GitHub", url: "#", icon: Github },
  { id: 2, platform: "LinkedIn", url: "#", icon: Briefcase },
  { id: 3, platform: "LeetCode", url: "#", icon: Code },
];

const currentProject = {
  title: "Distributed Key-Value Store",
  description:
    "Building a fault-tolerant KV store using Raft consensus algorithm in Go.",
};

const recentAchievement = {
  title: "1st Place - MIT Battlecode 2025",
};

const solvedQuestions = [
  {
    id: "q1",
    title: "Course Schedule II",
    difficulty: "Medium",
    topic: "Graphs",
    lang: "Python",
    date: "2 hours ago",
  },
  {
    id: "q2",
    title: "LRU Cache",
    difficulty: "Hard",
    topic: "Design",
    lang: "C++",
    date: "Yesterday",
  },
  {
    id: "q3",
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    topic: "Linked List",
    lang: "Java",
    date: "3 days ago",
  },
  {
    id: "q4",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    lang: "JavaScript",
    date: "1 week ago",
  },
];

// --- Utility Functions for Styling ---
function getDifficultyStyle(diff: string) {
  if (diff === "Easy")
    return "text-emerald-500 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800";
  if (diff === "Medium")
    return "text-brand-amber bg-brand-amber/10 border-brand-amber/30 dark:border-brand-amber/30";
  return "text-brand-red bg-brand-red/10 border-brand-red/30 dark:border-brand-red/30";
}

function getLangColor(lang: string) {
  const colors: Record<string, string> = {
    Python: "bg-yellow-400",
    "C++": "bg-blue-500",
    Java: "bg-orange-500",
    JavaScript: "bg-yellow-300",
  };
  return colors[lang] || "bg-gray-400";
}

export default function PublicStudentProfile() {
  // const [activeTab, setActiveTab] = useState("Overview");

  // Activity colors mapped to brand colors (Emerald scale for commits)
  const activityColors = [
    "bg-gray-100 dark:bg-gray-800",
    "bg-emerald-200 dark:bg-emerald-900",
    "bg-emerald-300 dark:bg-emerald-700",
    "bg-emerald-400 dark:bg-emerald-600",
    "bg-emerald-500 dark:bg-emerald-500",
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- LEFT SIDEBAR (Identity & Connect) --- */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex flex-col items-start bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm">
                {/* Avatar */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 mb-6 bg-gray-100 dark:bg-gray-900 shadow-md relative">
                  <Image
                    src={studentInfo.avatar}
                    alt={studentInfo.fullName}
                    className="w-full h-full object-cover"
                  />
                  {/* Status indicator */}
                  <div className="absolute bottom-3 right-3 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-gray-800 rounded-full" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {studentInfo.fullName}
                </h1>
                <p className="text-brand-blue font-mono text-sm mb-4">
                  @{studentInfo.username}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {studentInfo.profileDesc}
                </p>

                {/* Public Actions (Follow / Message) */}
                <div className="w-full flex gap-3 mb-6">
                  <button className="flex-1 py-2 px-4 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm">
                    <UserPlus className="w-4 h-4" /> Connect
                  </button>
                  <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>

                {/* Meta Info */}
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 w-full pt-6 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{studentInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>Class of {studentInfo.graduationYear}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <a
                      href={`https://${studentInfo.website}`}
                      className="hover:text-brand-blue truncate transition-colors"
                    >
                      {studentInfo.website}
                    </a>
                  </div>
                </div>

                {/* Skills */}
                <div className="w-full pt-6 mt-6 border-t border-gray-100 dark:border-gray-700/50">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
                    Top Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {studentInfo.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT CONTENT AREA --- */}
            <div className="lg:col-span-9 space-y-8">
              {/* 1. Grid for README and Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pinned Portfolio / README (Spans 2 cols) */}
                <div className="lg:col-span-2">
                  <section className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm h-full">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700/50 text-gray-500 dark:text-gray-400 text-sm font-mono">
                      <BookOpen className="w-4 h-4" />
                      <span>README.md</span>
                    </div>

                    <article className="prose dark:prose-invert max-w-none">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Hi there! 👋 I&apos;m Alice
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        I&apos;m a passionate developer currently solving
                        complex algorithmic challenges. I focus primarily on
                        distributed systems and backend engineering. When
                        I&apos;m not studying for my CS degree, you can find me
                        competing in hackathons or optimizing my Neovim config.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Current Project Card */}
                        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                            <Code className="w-4 h-4 text-brand-blue" /> Current
                            Focus
                          </h4>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {currentProject.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {currentProject.description}
                          </p>
                        </div>

                        {/* Recent Achievement Card */}
                        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                            <Trophy className="w-4 h-4 text-brand-amber" />{" "}
                            Highlight
                          </h4>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {recentAchievement.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Beat out 200+ teams in a 48-hour competitive
                            programming marathon.
                          </p>
                        </div>
                      </div>
                    </article>
                  </section>
                </div>

                {/* Right Sub-column: Academic & Links (Spans 1 col) */}
                <div className="space-y-8">
                  {/* Academic Info */}
                  <section className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-brand-blue" />{" "}
                      Academic Info
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                          University
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {academicInfo.university}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                          Degree
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {academicInfo.degree}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-4 mt-4">
                        <span className="text-gray-500">GPA</span>
                        <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {academicInfo.gpa}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* External Links */}
                  <section className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <LinkIcon className="w-5 h-5 text-gray-400" /> On the Web
                    </h3>
                    <div className="space-y-3">
                      {externalLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700/50 hover:border-brand-blue/30 dark:hover:border-brand-blue/50 hover:bg-gray-50 dark:hover:bg-gray-800/80 rounded-xl transition-all group"
                          >
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 group-hover:text-brand-blue transition-colors">
                              <Icon className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {link.platform}
                              </span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-blue transition-colors" />
                          </a>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>

              {/* 2. Contribution Graph Section */}
              <section className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    {contributionData.total.toLocaleString()} contributions in
                    the last year
                  </h2>
                </div>

                <div className="overflow-x-auto hide-scrollbar">
                  <div className="min-w-[750px]">
                    {/* Graph Container */}
                    <div className="grid grid-rows-7 grid-flow-col gap-[3px] w-fit">
                      {contributionData.grid.map((level, i) => (
                        <div
                          key={i}
                          className={`w-[11px] h-[11px] rounded-[2px] ${activityColors[level]}`}
                          title={`Activity level: ${level}`}
                        />
                      ))}
                    </div>

                    {/* Graph Footer */}
                    <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Learn how we count contributions</span>
                      <div className="flex items-center gap-1.5">
                        <span>Less</span>
                        {activityColors.map((className, i) => (
                          <div
                            key={i}
                            className={`w-[11px] h-[11px] ${className} rounded-[2px]`}
                          />
                        ))}
                        <span>More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Recently Solved Questions */}
              <section className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-brand-blue" />
                    Recent Submissions
                  </h2>
                  <Link
                    href={`/student/${studentInfo.id}/questions`}
                    className="text-sm font-medium text-brand-blue hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    View history &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {solvedQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="flex flex-col justify-between p-5 border border-gray-100 dark:border-gray-700/50 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-gray-800/30 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors flex items-center gap-2 mb-1">
                            {q.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded">
                              {q.topic}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border ${getDifficultyStyle(q.difficulty)}`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                        <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                          <div
                            className={`w-2 h-2 rounded-full ${getLangColor(q.lang)}`}
                          />
                          {q.lang}
                        </span>
                        <span>{q.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
