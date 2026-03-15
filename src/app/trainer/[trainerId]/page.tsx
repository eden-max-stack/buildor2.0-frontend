"use client";

import { useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
  Star,
  BookOpen,
  Users,
  MessageSquare,
  Award,
  ExternalLink,
  FileText,
  Quote,
  GraduationCap,
  Mail,
  CheckCircle2,
  ChevronRight,
  Plus,
} from "lucide-react";

// --- Mock Data ---
const trainerData = {
  id: "prof-turing",
  name: "Prof. Alan Turing",
  role: "Senior Algorithmic Instructor",
  department: "Computer Science Dept, MIT",
  avatar:
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200&h=200",
  rating: 4.9,
  totalReviews: 342,
  studentsTaught: "15k+",
  about:
    "Former Lead Engineer at a top-tier tech company with 10+ years of experience in distributed systems. Passionate about breaking down complex graph theory and dynamic programming concepts into intuitive, bite-sized lessons. My teaching philosophy focuses on pattern recognition rather than rote memorization.",
  education: [
    {
      degree: "Ph.D. in Computer Science",
      school: "Stanford University",
      year: "2015",
    },
    { degree: "M.S. in Applied Mathematics", school: "MIT", year: "2011" },
  ],
  classes: [
    {
      id: "CS401",
      name: "Advanced Graph Algorithms",
      level: "Advanced",
      students: 142,
      rating: 4.9,
      color: "brand-blue",
    },
    {
      id: "CS302",
      name: "Dynamic Programming Masterclass",
      level: "Intermediate",
      students: 315,
      rating: 4.8,
      color: "brand-amber",
    },
    {
      id: "SYS201",
      name: "System Design for Interviews",
      level: "Beginner",
      students: 890,
      rating: 4.9,
      color: "emerald-500",
    },
  ],
  publications: [
    {
      title: "Optimizing Network Flow in Distributed Microservices",
      journal: "Journal of Systems Architecture",
      year: "2024",
      type: "Research Paper",
    },
    {
      title: "A Novel Approach to State Machine Replication",
      journal: "IEEE Transactions on Computers",
      year: "2022",
      type: "Journal Article",
    },
    {
      title: "Demystifying Segment Trees for Competitive Programming",
      journal: "Tech Educator Blog",
      year: "2021",
      type: "Article",
    },
  ],
  feedback: [
    {
      text: "Prof. Turing's explanation of Dijkstra's algorithm finally made it click for me. The visual aids used in class are top-notch.",
      rating: 5,
      course: "CS401",
      date: "2 weeks ago",
    },
    {
      text: "Tough grader, but you will learn MORE in this class than any other. The assignments perfectly prepare you for FAANG interviews.",
      rating: 5,
      course: "CS302",
      date: "1 month ago",
    },
    {
      text: "Always answers questions clearly in the feedback portal. Wish the video lectures were slightly shorter, but the content is gold.",
      rating: 4,
      course: "CS401",
      date: "2 months ago",
    },
  ],
};

export default function TrainerProfile() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* 1. Top Hero Banner (LinkedIn Style) */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm">
            {/* Cover Photo Background */}
            <div className="h-32 md:h-48 bg-gradient-to-r from-brand-dark via-blue-900 to-gray-900 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 font-mono text-9xl -top-10 -right-10 pointer-events-none text-brand-blue">
                {"{}"}
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="px-6 md:px-10 pb-8 relative">
              {/* Avatar & Quick Actions Row */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                {/* Overlapping Avatar */}
                <div className="-mt-16 md:-mt-20 shrink-0">
                  <img
                    src={trainerData.avatar}
                    alt={trainerData.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-gray-100 shadow-lg"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2 md:pt-0">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    <Mail className="w-5 h-5" /> Mail
                  </button>
                </div>
              </div>

              {/* Name & Headline */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  {trainerData.name}
                  <CheckCircle2 className="w-6 h-6 text-brand-blue" />
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg mt-1 font-medium">
                  {trainerData.role}
                </p>
                <p className="text-sm font-mono text-gray-500 mt-2">
                  {trainerData.department}
                </p>
              </div>

              {/* About & Education (Integrated into Hero) */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700/50">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl">
                  {trainerData.about}
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-x-8 gap-y-2">
                  {trainerData.education.map((edu, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-brand-blue shrink-0" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {edu.degree}
                      </span>
                      <span className="text-gray-500">• {edu.school}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                      <Star className="w-5 h-5 fill-current" />
                      {trainerData.rating}
                    </div>
                    <span className="text-xs text-gray-500">
                      {trainerData.totalReviews} Reviews
                    </span>
                  </div>
                </div>

                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg leading-none">
                      {trainerData.studentsTaught}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Students Taught
                    </p>
                  </div>
                </div>

                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg leading-none">
                      {trainerData.classes.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Active Courses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Classes & Research (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              {/* 2. Classes Handled */}
              <section className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-blue" /> Current
                  Classes
                </h2>

                <div className="space-y-4">
                  {trainerData.classes.map((cls) => (
                    <Link
                      href={`/classes/${cls.id}`}
                      key={cls.id}
                      className="block group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 hover:border-brand-blue/30 dark:hover:border-brand-blue/30 transition-colors relative overflow-hidden">
                        {/* Left color accent */}
                        <div
                          className={`absolute top-0 left-0 w-1 h-full bg-${cls.color}`}
                        />

                        <div className="pl-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-500 bg-white dark:bg-gray-900 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                              {cls.id}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                cls.level === "Advanced"
                                  ? "bg-brand-red/10 text-brand-red"
                                  : cls.level === "Intermediate"
                                    ? "bg-brand-amber/10 text-brand-amber"
                                    : "bg-emerald-500/10 text-emerald-500"
                              }`}
                            >
                              {cls.level}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 ml-2">
                              <Star className="w-3.5 h-3.5 text-brand-amber fill-brand-amber" />
                              {cls.rating}
                            </div>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-blue transition-colors">
                            {cls.name}
                          </h3>
                        </div>

                        <div className="mt-3 sm:mt-0 pl-2 sm:pl-0 flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" /> {cls.students}{" "}
                            Enrolled
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-blue transition-colors hidden sm:block" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* 4. Research & Attestation */}
              <section className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-amber" /> Publications
                  & Research
                </h2>

                <div className="space-y-4">
                  {trainerData.publications.map((pub, idx) => (
                    <a href="#" key={idx} className="block group">
                      <div className="p-4 rounded-xl border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:border-gray-200 dark:hover:border-gray-700/50 transition-colors flex items-start gap-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-emerald-500 flex items-start gap-2 transition-colors text-sm md:text-base">
                            {pub.title}
                            <ExternalLink className="w-3.5 h-3.5 mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500 font-mono">
                            <span className="bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">
                              {pub.type}
                            </span>
                            <span>•</span>
                            <span>{pub.journal}</span>
                            <span>•</span>
                            <span>{pub.year}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Feedback (1/3 width) */}
            <div className="lg:col-span-1">
              {/* 5. Anonymous Feedback */}
              <section className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm h-full">
                {/* UPDATED HEADER: Added the Leave Feedback Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-500" />{" "}
                    Student Feedback
                  </h2>
                  <button
                    onClick={() => {
                      /* Open your feedback modal here */
                    }}
                    className="shrink-0 text-sm bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 dark:bg-brand-blue/20 dark:hover:bg-brand-blue/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {trainerData.feedback.map((review, idx) => (
                    <div key={idx} className="relative">
                      {/* Quote Icon Background */}
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-100 dark:text-gray-800 rotate-180 -z-10" />

                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700/30 relative">
                        {/* Stars */}
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? "text-brand-amber fill-brand-amber" : "text-gray-300 dark:text-gray-600"}`}
                            />
                          ))}
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-4 leading-relaxed">
                          "{review.text}"
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium border-t border-gray-200 dark:border-gray-700/50 pt-3">
                          <span className="font-mono text-brand-blue">
                            {review.course}
                          </span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50 text-center">
                  <button className="text-sm text-brand-blue font-medium hover:text-blue-600 transition-colors">
                    Load more feedback &rarr;
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
