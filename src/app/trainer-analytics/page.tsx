"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Users,
  BookOpen,
  ClipboardList,
  Calendar,
  MessageSquare,
  AlertCircle,
  Clock,
  GraduationCap,
  BarChart3,
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────

interface ClassInfo {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  nextSession: string;
  progress: number;
}

interface FeedbackItem {
  id: number;
  studentName: string;
  classCode: string;
  type: "complaint" | "feedback" | "request";
  message: string;
  date: string;
  read: boolean;
}

interface Task {
  id: number;
  title: string;
  classCode: string;
  dueDate: string;
  type: "assignment" | "quiz" | "exam" | "review";
  status: "upcoming" | "overdue" | "grading";
}

interface CalendarEvent {
  date: number;
  title: string;
  type: "exam" | "quiz" | "deadline" | "session";
}

const mockClasses: ClassInfo[] = [
  {
    id: "cs201",
    name: "Data Structures & Algorithms",
    code: "CS201",
    studentCount: 45,
    nextSession: "Mon, 10:00 AM",
    progress: 68,
  },
  {
    id: "cs301",
    name: "Advanced Algorithms",
    code: "CS301",
    studentCount: 32,
    nextSession: "Tue, 2:00 PM",
    progress: 42,
  },
  {
    id: "cs102",
    name: "Introduction to Programming",
    code: "CS102",
    studentCount: 60,
    nextSession: "Wed, 9:00 AM",
    progress: 85,
  },
  {
    id: "cs405",
    name: "Machine Learning Fundamentals",
    code: "CS405",
    studentCount: 28,
    nextSession: "Thu, 11:00 AM",
    progress: 35,
  },
];

const mockFeedback: FeedbackItem[] = [
  {
    id: 1,
    studentName: "Alice Johnson",
    classCode: "CS201",
    type: "complaint",
    message:
      "The last assignment on graph traversal was too difficult without prior examples covered in class.",
    date: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    studentName: "Bob Smith",
    classCode: "CS301",
    type: "feedback",
    message:
      "Really enjoyed the dynamic programming module. The step-by-step breakdowns were very helpful.",
    date: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    studentName: "Carol Williams",
    classCode: "CS102",
    type: "request",
    message:
      "Could we have an extra office hours session before the midterm exam next week?",
    date: "1 day ago",
    read: true,
  },
  {
    id: 4,
    studentName: "David Brown",
    classCode: "CS201",
    type: "complaint",
    message:
      "The auto-grader seems to have a bug with edge cases on the linked list assignment.",
    date: "1 day ago",
    read: true,
  },
  {
    id: 5,
    studentName: "Emma Davis",
    classCode: "CS405",
    type: "feedback",
    message:
      "The neural network visualization tool you shared was excellent for understanding backpropagation.",
    date: "2 days ago",
    read: true,
  },
];

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Grade Assignment 4: Binary Trees",
    classCode: "CS201",
    dueDate: "Tomorrow",
    type: "review",
    status: "grading",
  },
  {
    id: 2,
    title: "Midterm Examination",
    classCode: "CS102",
    dueDate: "Mar 12, 2026",
    type: "exam",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Quiz 3: Divide & Conquer",
    classCode: "CS301",
    dueDate: "Mar 10, 2026",
    type: "quiz",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Assignment 2: Regression Models",
    classCode: "CS405",
    dueDate: "Mar 8, 2026",
    type: "assignment",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Grade Quiz 2: Sorting Algorithms",
    classCode: "CS201",
    dueDate: "Overdue",
    type: "review",
    status: "overdue",
  },
];

const calendarEvents: CalendarEvent[] = [
  { date: 5, title: "CS201 Session", type: "session" },
  { date: 8, title: "CS405 Assignment Due", type: "deadline" },
  { date: 10, title: "CS301 Quiz 3", type: "quiz" },
  { date: 12, title: "CS102 Midterm", type: "exam" },
  { date: 15, title: "CS201 Session", type: "session" },
  { date: 18, title: "CS301 Assignment Due", type: "deadline" },
  { date: 22, title: "CS405 Quiz 1", type: "quiz" },
  { date: 25, title: "CS201 Session", type: "session" },
  { date: 28, title: "CS102 Final Project Due", type: "deadline" },
];

// ── Component ──────────────────────────────────────────────

export default function TrainerAnalytics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState<"all" | "unread">("all");
  const [calendarMonth] = useState("March 2026");

  const filteredClasses = mockClasses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredFeedback =
    feedbackFilter === "unread"
      ? mockFeedback.filter((f) => !f.read)
      : mockFeedback;

  const totalStudents = mockClasses.reduce((s, c) => s + c.studentCount, 0);
  const pendingTasks = mockTasks.filter(
    (t) => t.status === "grading" || t.status === "overdue",
  ).length;
  const unreadFeedback = mockFeedback.filter((f) => !f.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "complaint":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      case "feedback":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
      case "request":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "text-red-600 dark:text-red-400";
      case "grading":
        return "text-amber-600 dark:text-amber-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "exam":
        return <BookOpen className="w-4 h-4" />;
      case "quiz":
        return <ClipboardList className="w-4 h-4" />;
      case "review":
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <ClipboardList className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "exam":
        return "bg-red-500";
      case "quiz":
        return "bg-amber-500";
      case "deadline":
        return "bg-blue-500";
      case "session":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  // Simple calendar grid for March 2026 (starts on Sunday)
  const daysInMonth = 31;
  const startDay = 0; // March 1, 2026 is a Sunday
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-brand-dark dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-brand-blue" />
            Trainer Analytics
          </h1>
        </div>

        {/* Stats Row */}
        <div className="mb-6 bg-gray-900 dark:bg-gray-800 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">Classes</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {mockClasses.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg p-4 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-gray-400">Total Students</span>
              </div>
              <p className="text-3xl font-bold text-white">{totalStudents}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg p-4 border border-amber-500/30">
              <div className="flex items-center gap-3 mb-2">
                <ClipboardList className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-gray-400">Pending Tasks</span>
              </div>
              <p className="text-3xl font-bold text-white">{pendingTasks}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">Unread Feedback</span>
              </div>
              <p className="text-3xl font-bold text-white">{unreadFeedback}</p>
            </div>
          </div>
        </div>

        {/* Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Classes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Classes Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-brand-dark dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-blue" />
                  Your Classes
                </h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search classes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all dark:bg-blue-800/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filteredClasses.map((cls) => (
                  <Link
                    key={cls.id}
                    href={`/trainer-analytics/classes/${cls.id}`}
                    className="bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between group block"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-blue to-brand-blue/70 flex items-center justify-center text-white font-bold text-xs">
                        {cls.code}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-brand-dark dark:text-white">
                          {cls.name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {cls.studentCount} students
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {cls.nextSession}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Progress Bar */}
                      <div className="hidden sm:flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-blue rounded-full"
                            style={{ width: `${cls.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-10">
                          {cls.progress}%
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div>
              <h2 className="text-lg font-bold text-brand-dark dark:text-white flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-brand-blue" />
                Upcoming Tasks
              </h2>
              <div className="space-y-2">
                {mockTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`p-2 rounded-lg ${
                          task.status === "overdue"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : task.status === "grading"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {getTaskIcon(task.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-brand-dark dark:text-white text-sm">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {task.classCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-medium ${getTaskStatusColor(task.status)}`}
                      >
                        {task.dueDate}
                      </span>
                      {task.status === "overdue" && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Calendar */}
          <div className="space-y-6">
            {/* Calendar Widget */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-bold text-brand-dark dark:text-white flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-brand-blue" />
                {calendarMonth}
              </h2>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  const events = day
                    ? calendarEvents.filter((e) => e.date === day)
                    : [];
                  const isToday = day === 5;
                  return (
                    <div
                      key={i}
                      className={`relative text-center py-2 rounded-lg text-sm ${
                        day
                          ? isToday
                            ? "bg-brand-blue text-white font-bold"
                            : events.length > 0
                              ? "bg-blue-50 dark:bg-blue-900/20 font-medium text-brand-dark dark:text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                          : ""
                      } cursor-default`}
                      title={events.map((e) => e.title).join(", ")}
                    >
                      {day}
                      {events.length > 0 && (
                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {events.map((ev, j) => (
                            <div
                              key={j}
                              className={`w-1 h-1 rounded-full ${getEventColor(ev.type)}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> Exam
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> Quiz
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> Deadline
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                  Session
                </span>
              </div>
            </div>

            {/* Quick Class Stats */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-bold text-brand-dark dark:text-white mb-4 text-sm">
                Syllabus Progress
              </h3>
              <div className="space-y-3">
                {mockClasses.map((cls) => (
                  <div key={cls.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {cls.code}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {cls.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cls.progress >= 80
                            ? "bg-emerald-500"
                            : cls.progress >= 50
                              ? "bg-brand-blue"
                              : "bg-amber-500"
                        }`}
                        style={{ width: `${cls.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback & Complaints Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-dark dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-blue" />
              Student Feedback & Complaints
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFeedbackFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  feedbackFilter === "all"
                    ? "bg-brand-blue text-white"
                    : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-blue"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFeedbackFilter("unread")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  feedbackFilter === "unread"
                    ? "bg-brand-blue text-white"
                    : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-blue"
                }`}
              >
                Unread
                {unreadFeedback > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadFeedback}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {filteredFeedback.map((item) => (
              <div
                key={item.id}
                className={`bg-white dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700 ${
                  !item.read ? "border-l-4 border-l-brand-blue" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-brand-dark dark:text-white text-sm">
                        {item.studentName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}
                      >
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {item.classCode}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {item.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
