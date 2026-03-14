"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Users,
  BookOpen,
  ArrowLeft,
  Send,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Award,
  Code2,
  GraduationCap,
  Plus,
  Edit,
  FileText,
  Video,
  X,
  Save,
} from "lucide-react";

// ── Category Tags (matches questions page) ─────────────────

const ALL_CATEGORIES = [
  "Arrays",
  "Hash Table",
  "Linked List",
  "String",
  "Backtracking",
  "Dynamic Programming",
  "Recursion",
  "Two Pointers",
  "Sorting",
  "Stack",
  "Heap",
  "Math",
  "Binary Search",
  "Divide and Conquer",
  "Sliding Window",
];

// ── Mock Data ──────────────────────────────────────────────

interface ClassDetail {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  avgScore: number;
  topPerformer: string;
  completionRate: number;
}

interface StudentPerformance {
  [category: string]: number; // 0-100
}

interface StudentFeedbackItem {
  id: number;
  from: "trainer";
  message: string;
  date: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  rank: number;
  problemsSolved: number;
  totalProblems: number;
  skillLevel: string;
  performance: StudentPerformance;
  feedback: StudentFeedbackItem[];
}

const classDetails: Record<string, ClassDetail> = {
  cs201: {
    id: "cs201",
    name: "Data Structures & Algorithms",
    code: "CS201",
    studentCount: 45,
    avgScore: 72,
    topPerformer: "Alice Johnson",
    completionRate: 68,
  },
  cs301: {
    id: "cs301",
    name: "Advanced Algorithms",
    code: "CS301",
    studentCount: 32,
    avgScore: 65,
    topPerformer: "Frank Lee",
    completionRate: 42,
  },
  cs102: {
    id: "cs102",
    name: "Introduction to Programming",
    code: "CS102",
    studentCount: 60,
    avgScore: 78,
    topPerformer: "Grace Kim",
    completionRate: 85,
  },
  cs405: {
    id: "cs405",
    name: "Machine Learning Fundamentals",
    code: "CS405",
    studentCount: 28,
    avgScore: 58,
    topPerformer: "Henry Zhang",
    completionRate: 35,
  },
};

const generateStudentPerformance = (seed: number): StudentPerformance => {
  const perf: StudentPerformance = {};
  ALL_CATEGORIES.forEach((cat, i) => {
    // Deterministic pseudo-random based on seed + index
    perf[cat] = Math.min(
      100,
      Math.max(0, Math.round((seed * 7 + i * 13) % 100)),
    );
  });
  return perf;
};

const mockStudents: Record<string, Student[]> = {
  cs201: [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.j@university.edu",
      rank: 1,
      problemsSolved: 42,
      totalProblems: 50,
      skillLevel: "Expert",
      performance: generateStudentPerformance(1),
      feedback: [
        {
          id: 1,
          from: "trainer",
          message:
            "Excellent work on the graph traversal assignment. Keep it up!",
          date: "Mar 2",
        },
        {
          id: 2,
          from: "trainer",
          message: "Try to focus more on edge cases in your solutions.",
          date: "Feb 20",
        },
      ],
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.s@university.edu",
      rank: 2,
      problemsSolved: 38,
      totalProblems: 50,
      skillLevel: "Advanced",
      performance: generateStudentPerformance(2),
      feedback: [
        {
          id: 1,
          from: "trainer",
          message:
            "Good progress on dynamic programming. Review memoization patterns.",
          date: "Mar 1",
        },
      ],
    },
    {
      id: 3,
      name: "Carol Williams",
      email: "carol.w@university.edu",
      rank: 3,
      problemsSolved: 35,
      totalProblems: 50,
      skillLevel: "Advanced",
      performance: generateStudentPerformance(3),
      feedback: [],
    },
    {
      id: 4,
      name: "David Brown",
      email: "david.b@university.edu",
      rank: 4,
      problemsSolved: 30,
      totalProblems: 50,
      skillLevel: "Intermediate",
      performance: generateStudentPerformance(4),
      feedback: [
        {
          id: 1,
          from: "trainer",
          message:
            "Need to improve on tree-based problems. Schedule a 1-on-1 session.",
          date: "Feb 28",
        },
      ],
    },
    {
      id: 5,
      name: "Emma Davis",
      email: "emma.d@university.edu",
      rank: 5,
      problemsSolved: 28,
      totalProblems: 50,
      skillLevel: "Intermediate",
      performance: generateStudentPerformance(5),
      feedback: [],
    },
    {
      id: 6,
      name: "Frank Lee",
      email: "frank.l@university.edu",
      rank: 6,
      problemsSolved: 25,
      totalProblems: 50,
      skillLevel: "Intermediate",
      performance: generateStudentPerformance(6),
      feedback: [
        {
          id: 1,
          from: "trainer",
          message:
            "Great improvement this month! Focus on harder problems now.",
          date: "Mar 3",
        },
      ],
    },
    {
      id: 7,
      name: "Grace Kim",
      email: "grace.k@university.edu",
      rank: 7,
      problemsSolved: 22,
      totalProblems: 50,
      skillLevel: "Beginner",
      performance: generateStudentPerformance(7),
      feedback: [],
    },
    {
      id: 8,
      name: "Henry Zhang",
      email: "henry.z@university.edu",
      rank: 8,
      problemsSolved: 18,
      totalProblems: 50,
      skillLevel: "Beginner",
      performance: generateStudentPerformance(8),
      feedback: [
        {
          id: 1,
          from: "trainer",
          message:
            "Please attend the upcoming office hours for extra help with arrays.",
          date: "Feb 25",
        },
      ],
    },
  ],
};

// Reuse cs201 students for other classes with slight variations
mockStudents["cs301"] = mockStudents["cs201"].slice(0, 5).map((s, i) => ({
  ...s,
  id: s.id + 100,
  rank: i + 1,
  problemsSolved: Math.max(5, s.problemsSolved - 10),
  performance: generateStudentPerformance(s.id + 50),
}));
mockStudents["cs102"] = mockStudents["cs201"].map((s, i) => ({
  ...s,
  id: s.id + 200,
  rank: i + 1,
  problemsSolved: Math.min(50, s.problemsSolved + 5),
  performance: generateStudentPerformance(s.id + 100),
}));
mockStudents["cs405"] = mockStudents["cs201"].slice(0, 4).map((s, i) => ({
  ...s,
  id: s.id + 300,
  rank: i + 1,
  problemsSolved: Math.max(5, s.problemsSolved - 15),
  performance: generateStudentPerformance(s.id + 150),
}));

// ── Component ──────────────────────────────────────────────

function PerformanceChart({
  performance,
}: {
  performance: StudentPerformance;
}) {
  const maxVal = 100;

  const getBarColor = (value: number) => {
    if (value >= 75) return "bg-emerald-500 dark:bg-emerald-400";
    if (value >= 50) return "bg-brand-blue dark:bg-blue-400";
    if (value >= 25) return "bg-amber-500 dark:bg-amber-400";
    return "bg-red-500 dark:bg-red-400";
  };

  return (
    <div className="space-y-2">
      {ALL_CATEGORIES.map((cat) => {
        const val = performance[cat] ?? 0;
        return (
          <div key={cat} className="flex items-center gap-3">
            <span
              className="text-xs text-gray-600 dark:text-gray-400 w-32 truncate"
              title={cat}
            >
              {cat}
            </span>
            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getBarColor(val)}`}
                style={{ width: `${val}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-8 text-right">
              {val}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StudentCard({
  student,
  classId,
}: {
  student: Student;
  classId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [localFeedback, setLocalFeedback] = useState(student.feedback);

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;
    const newFeedback: StudentFeedbackItem = {
      id: localFeedback.length + 1,
      from: "trainer",
      message: feedbackText.trim(),
      date: "Just now",
    };
    setLocalFeedback([newFeedback, ...localFeedback]);
    setFeedbackText("");
  };

  const getSkillColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
      case "Advanced":
        return "bg-blue-100 text-brand-blue dark:bg-blue-900/50 dark:text-blue-300";
      case "Intermediate":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/30 dark:text-amber-200";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const completionPct = Math.round(
    (student.problemsSolved / student.totalProblems) * 100,
  );

  return (
    <div>
      {/* Student Row */}
      <div
        className="bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue/60 flex items-center justify-center text-white font-bold text-sm">
            {student.rank}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-brand-dark dark:text-white">
              {student.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {student.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {student.problemsSolved}/{student.totalProblems}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Solved</p>
            </div>
          </div>
          <span
            className={`hidden md:inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSkillColor(student.skillLevel)}`}
          >
            {student.skillLevel}
          </span>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Performance Chart */}
            <div>
              <h4 className="font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4 text-brand-blue" />
                Category Performance
              </h4>
              <PerformanceChart performance={student.performance} />
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> 75%+
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-brand-blue" /> 50-74%
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> 25-49%
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> &lt;25%
                </span>
              </div>
            </div>

            {/* Right: Feedback Section */}
            <div>
              <h4 className="font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-brand-blue" />
                Trainer Feedback
              </h4>

              {/* Feedback Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Write feedback for this student..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendFeedback()}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all dark:bg-gray-700/50 dark:text-white"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendFeedback();
                  }}
                  className="px-3 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Feedback History */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {localFeedback.length > 0 ? (
                  localFeedback.map((fb) => (
                    <div
                      key={fb.id}
                      className="bg-white dark:bg-gray-700/30 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-brand-blue dark:text-blue-400">
                          You
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {fb.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {fb.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No feedback sent yet. Write your first message above.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page Component ─────────────────────────────────────────

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.classId as string;
  const [activeTab, setActiveTab] = useState<"students" | "materials">(
    "students",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "solved" | "name">("rank");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  const classInfo = classDetails[classId];
  const students = mockStudents[classId] || [];

  const filteredStudents = useMemo(() => {
    let filtered = students.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    if (sortBy === "solved") {
      filtered = [...filtered].sort(
        (a, b) => b.problemsSolved - a.problemsSolved,
      );
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  }, [searchQuery, sortBy, students]);

  if (!classInfo) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Class not found
            </p>
            <Link
              href="/trainer-analytics"
              className="text-brand-blue hover:underline mt-2 inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link + Header */}
        <div className="mb-6">
          <Link
            href="/trainer-analytics"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-blue dark:hover:text-blue-400 flex items-center gap-1 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-brand-dark dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-blue" />
            {classInfo.code}: {classInfo.name}
          </h1>
        </div>

        {/* Class Stats */}
        <div className="mb-6 bg-gray-900 dark:bg-gray-800 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">Students</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {classInfo.studentCount}
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg p-4 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-gray-400">Avg Score</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {classInfo.avgScore}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg p-4 border border-amber-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-gray-400">Top Performer</span>
              </div>
              <p className="text-lg font-bold text-white truncate">
                {classInfo.topPerformer}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">Completion</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {classInfo.completionRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === "students"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Students ({students.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("materials")}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === "materials"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course Materials
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "students" ? (
          <>
            {/* Search & Sort Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all dark:bg-blue-800/10 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("rank")}
                  title="Sort by Rank"
                  className={`p-3 rounded-lg transition-all ${
                    sortBy === "rank"
                      ? "bg-brand-blue text-white"
                      : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-blue hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <Award className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSortBy("solved")}
                  title="Sort by Problems Solved"
                  className={`p-3 rounded-lg transition-all ${
                    sortBy === "solved"
                      ? "bg-brand-blue text-white"
                      : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-blue hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSortBy("name")}
                  title="Sort by Name"
                  className={`p-3 rounded-lg transition-all ${
                    sortBy === "name"
                      ? "bg-brand-blue text-white"
                      : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-blue hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Student Count */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-brand-blue">
                {filteredStudents.length}
              </span>{" "}
              of {students.length} students
            </div>

            {/* Students List */}
            <div className="space-y-0">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    classId={classId}
                  />
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No students found
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your search
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <CourseMaterialsTab
            classId={classId}
            showQuestionForm={showQuestionForm}
            setShowQuestionForm={setShowQuestionForm}
            editingQuestion={editingQuestion}
            setEditingQuestion={setEditingQuestion}
          />
        )}
      </div>
    </Layout>
  );
}

// ── Course Materials Tab Component ─────────────────────────

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  constraints: string[];
  optimal_solution: string;
  time_complexity?: string;
  space_complexity?: string;
  test_cases: TestCase[];
  created_at: string;
}

interface TestCase {
  input: any;
  expected_output: any;
  is_sample: boolean;
}

function CourseMaterialsTab({
  classId,
  showQuestionForm,
  setShowQuestionForm,
  editingQuestion,
  setEditingQuestion,
}: {
  classId: string;
  showQuestionForm: boolean;
  setShowQuestionForm: (show: boolean) => void;
  editingQuestion: Question | null;
  setEditingQuestion: (q: Question | null) => void;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeSection, setActiveSection] = useState<
    "questions" | "articles" | "videos"
  >("questions");

  // Mock articles and videos
  const mockArticles = [
    {
      id: 1,
      title: "Understanding Dynamic Programming",
      author: "Prof. Smith",
      date: "Mar 10, 2026",
      reads: 45,
    },
    {
      id: 2,
      title: "Graph Algorithms Cheat Sheet",
      author: "Alice Johnson",
      date: "Mar 8, 2026",
      reads: 32,
    },
    {
      id: 3,
      title: "Time Complexity Analysis Guide",
      author: "Prof. Smith",
      date: "Mar 5, 2026",
      reads: 58,
    },
  ];

  const mockVideos = [
    {
      id: 1,
      title: "Binary Search Trees Explained",
      duration: "15:30",
      views: 120,
      date: "Mar 12, 2026",
    },
    {
      id: 2,
      title: "Sorting Algorithms Visualization",
      duration: "22:45",
      views: 95,
      date: "Mar 9, 2026",
    },
    {
      id: 3,
      title: "Recursion Deep Dive",
      duration: "18:20",
      views: 78,
      date: "Mar 6, 2026",
    },
  ];

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionForm(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300";
      case "Medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
      case "Hard":
        return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection("questions")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === "questions"
                ? "bg-brand-blue text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Questions
            </div>
          </button>
          <button
            onClick={() => setActiveSection("articles")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === "articles"
                ? "bg-brand-blue text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Articles
            </div>
          </button>
          <button
            onClick={() => setActiveSection("videos")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === "videos"
                ? "bg-brand-blue text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videos
            </div>
          </button>
        </div>

        {activeSection === "questions" && (
          <button
            onClick={handleCreateQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Question
          </button>
        )}
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <QuestionForm
          classId={classId}
          question={editingQuestion}
          onClose={() => {
            setShowQuestionForm(false);
            setEditingQuestion(null);
          }}
          onSave={(newQuestion) => {
            if (editingQuestion) {
              setQuestions(
                questions.map((q) =>
                  q.id === newQuestion.id ? newQuestion : q,
                ),
              );
            } else {
              setQuestions([newQuestion, ...questions]);
            }
            setShowQuestionForm(false);
            setEditingQuestion(null);
          }}
        />
      )}

      {/* Content Sections */}
      {activeSection === "questions" && (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                No questions yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Create your first coding question for this class
              </p>
              <button
                onClick={handleCreateQuestion}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Question
              </button>
            </div>
          ) : (
            questions.map((question) => (
              <div
                key={question.id}
                className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-brand-blue dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-brand-dark dark:text-white mb-2">
                      {question.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {question.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}
                      >
                        {question.difficulty}
                      </span>
                      {question.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {question.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{question.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-blue dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Created {new Date(question.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSection === "articles" && (
        <div className="space-y-4">
          {mockArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-brand-blue dark:hover:border-blue-500 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-brand-dark dark:text-white mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.reads} reads</span>
                  </div>
                </div>
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === "videos" && (
        <div className="space-y-4">
          {mockVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-brand-blue dark:hover:border-blue-500 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-brand-dark dark:text-white mb-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{video.duration}</span>
                    <span>•</span>
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span>{video.date}</span>
                  </div>
                </div>
                <Video className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Question Form Component ────────────────────────────────

function QuestionForm({
  classId,
  question,
  onClose,
  onSave,
}: {
  classId: string;
  question: Question | null;
  onClose: () => void;
  onSave: (question: Question) => void;
}) {
  const [formData, setFormData] = useState({
    title: question?.title || "",
    description: question?.description || "",
    difficulty:
      question?.difficulty || ("Medium" as "Easy" | "Medium" | "Hard"),
    tags: question?.tags.join(", ") || "",
    constraints: question?.constraints.join("\n") || "",
    optimal_solution: question?.optimal_solution || "",
    time_complexity: question?.time_complexity || "",
    space_complexity: question?.space_complexity || "",
    test_cases: question?.test_cases || [
      { input: {}, expected_output: {}, is_sample: true },
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newQuestion: Question = {
      id: question?.id || `q-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      constraints: formData.constraints.split("\n").filter(Boolean),
      optimal_solution: formData.optimal_solution,
      time_complexity: formData.time_complexity,
      space_complexity: formData.space_complexity,
      test_cases: formData.test_cases,
      created_at: question?.created_at || new Date().toISOString(),
    };

    onSave(newQuestion);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-dark dark:text-white">
            {question ? "Edit Question" : "Create New Question"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Two Sum Problem"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
              placeholder="Describe the problem..."
            />
          </div>

          {/* Difficulty and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags * (comma-separated)
              </label>
              <input
                type="text"
                required
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Arrays, Hash Table"
              />
            </div>
          </div>

          {/* Constraints */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Constraints (one per line)
            </label>
            <textarea
              value={formData.constraints}
              onChange={(e) =>
                setFormData({ ...formData, constraints: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none dark:bg-gray-700 dark:text-white font-mono text-sm"
              placeholder="1 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9"
            />
          </div>

          {/* Optimal Solution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Optimal Solution (Python) *
            </label>
            <textarea
              required
              value={formData.optimal_solution}
              onChange={(e) =>
                setFormData({ ...formData, optimal_solution: e.target.value })
              }
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none dark:bg-gray-700 dark:text-white font-mono text-sm"
              placeholder="def solution(nums):\n    # Your solution here\n    pass"
            />
          </div>

          {/* Complexity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Complexity
              </label>
              <input
                type="text"
                value={formData.time_complexity}
                onChange={(e) =>
                  setFormData({ ...formData, time_complexity: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                placeholder="e.g., O(n)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Space Complexity
              </label>
              <input
                type="text"
                value={formData.space_complexity}
                onChange={(e) =>
                  setFormData({ ...formData, space_complexity: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                placeholder="e.g., O(1)"
              />
            </div>
          </div>

          {/* Test Cases Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Test cases will be added in the next step
              after question creation.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {question ? "Update Question" : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
