"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Search,
  Filter,
  CheckSquare,
  Square,
  Star,
  MessageSquare,
} from "lucide-react";

// --- Mock Data ---
const classInfo = {
  id: "CS401",
  name: "Advanced Graph Algorithms",
  description:
    "Dive deep into complex graph theory and implementation. Topics include network flow, bipartite matching, shortest paths in specialized graphs, and advanced tree structures. Designed for competitive programmers and system architects.",
  trainer: {
    id: "prof-turing",
    name: "Prof. Alan Turing",
    role: "Senior Algorithmic Instructor",
  },
  students: 142,
  progress: 75,
};

const tabs = [
  { id: "materials", label: "Materials", icon: BookOpen },
  { id: "questions", label: "Questions", icon: Code2 },
  { id: "tasks", label: "Tasks", icon: CheckCircle2 },
  { id: "people", label: "People & Feedback", icon: Users },
];

const courseModules = [
  {
    id: "m1",
    title: "Unit 1: Graph Representations",
    items: [
      {
        id: "i1",
        title: "Adjacency Matrix vs. Adjacency List",
        type: "Article",
        duration: "10 min read",
        completed: true,
      },
      {
        id: "i2",
        title: "Implementing an Adjacency List",
        type: "Video",
        duration: "15 min video",
        completed: true,
      },
      {
        id: "i3",
        title: "Build a Graph",
        type: "Question",
        diff: "Easy",
        completed: true,
      },
    ],
  },
  {
    id: "m2",
    title: "Unit 2: Graph Traversals",
    items: [
      {
        id: "i4",
        title: "Breadth-First Search (BFS) Intuition",
        type: "Video",
        duration: "25 min video",
        completed: false,
      },
      {
        id: "i5",
        title: "Shortest Path in Unweighted Graphs",
        type: "Article",
        duration: "15 min read",
        completed: false,
      },
      {
        id: "i6",
        title: "Rotting Oranges",
        type: "Question",
        diff: "Medium",
        completed: false,
      },
      {
        id: "i7",
        title: "Word Ladder",
        type: "Question",
        diff: "Hard",
        completed: false,
      },
    ],
  },
];

// --- Mock Data for Class Questions ---
interface Question {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  acceptance: number;
  solved: number;
}

const classQuestions: Question[] = [
  {
    id: 1,
    title: "Find Center of Star Graph",
    difficulty: "Easy",
    tags: ["Graphs"],
    acceptance: 84.3,
    solved: 15234,
  },
  {
    id: 2,
    title: "Number of Islands",
    difficulty: "Medium",
    tags: ["Graphs", "DFS", "BFS"],
    acceptance: 56.5,
    solved: 8923,
  },
  {
    id: 3,
    title: "Course Schedule",
    difficulty: "Medium",
    tags: ["Graphs", "Topological Sort"],
    acceptance: 45.2,
    solved: 9123,
  },
  {
    id: 4,
    title: "Alien Dictionary",
    difficulty: "Hard",
    tags: ["Graphs", "Topological Sort", "String"],
    acceptance: 27.4,
    solved: 5234,
  },
  {
    id: 5,
    title: "Word Ladder",
    difficulty: "Hard",
    tags: ["Graphs", "BFS", "Hash Table"],
    acceptance: 36.1,
    solved: 7234,
  },
  {
    id: 6,
    title: "Clone Graph",
    difficulty: "Medium",
    tags: ["Graphs", "Hash Table", "DFS"],
    acceptance: 53.5,
    solved: 4123,
  },
  {
    id: 7,
    title: "Network Delay Time",
    difficulty: "Medium",
    tags: ["Graphs", "Shortest Path"],
    acceptance: 52.2,
    solved: 8234,
  },
];

const ALL_TAGS = [
  "Graphs",
  "DFS",
  "BFS",
  "Topological Sort",
  "Shortest Path",
  "Hash Table",
  "String",
];

export default function ClassHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("questions"); // Set to questions by default for testing

  // States for Question Bank Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredQuestions = useMemo(() => {
    return classQuestions.filter((question) => {
      const matchesSearch = question.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === "All" ||
        question.difficulty === selectedDifficulty;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => question.tags.includes(tag));
      return matchesSearch && matchesDifficulty && matchesTags;
    });
  }, [searchQuery, selectedDifficulty, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  //   const handleQuestionClick = (question: Question) => {
  const handleQuestionClick = () => {
    // router.push(`/classes/${classInfo.id}/sandbox?id=${question.id}`);
    router.push(`/classes/${classInfo.id}/sandbox?id=14`); // default set to 14 question as it is the only one which has proper mock data
  };

  const getDifficultyColor = (difficulty: string) => {
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
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] text-brand-dark dark:text-gray-200 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Class Header Banner */}
          <div className="relative bg-gradient-to-r from-brand-dark to-blue-900 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 overflow-hidden shadow-xl border border-gray-800">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Code2 className="w-48 h-48 text-brand-blue" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <span className="inline-block px-3 py-1 bg-brand-blue/20 text-brand-blue border border-brand-blue/30 rounded-full text-xs font-mono mb-4">
                  {classInfo.id}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {classInfo.name}
                </h1>

                <p className="text-gray-300 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                  {classInfo.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    Trainer:
                    <Link
                      href={`/trainer/${classInfo.trainer.id}`}
                      className="text-brand-blue hover:text-blue-400 font-medium inline-flex items-center gap-1 transition-colors group"
                    >
                      {classInfo.trainer.name}
                      <ExternalLink className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </Link>
                  </span>
                  <span className="text-gray-600 dark:text-gray-500 hidden sm:inline">
                    •
                  </span>
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-500" />
                    {classInfo.students} Students
                  </span>
                </div>
              </div>

              <div className="w-full md:w-64 shrink-0">
                <div className="flex justify-between text-xs mb-2 text-gray-300">
                  <span>Course Progress</span>
                  <span className="font-mono">{classInfo.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-brand-blue h-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: `${classInfo.progress}%` }}
                  />
                </div>
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
            {/* MATERIALS TAB */}
            {activeTab === "materials" && (
              <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {courseModules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-white dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden shadow-sm"
                  >
                    {/* Material Tab Content logic remains exactly the same */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {module.title}
                      </h3>
                      <span className="text-xs font-mono text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {module.items.filter((i) => i.completed).length}/
                        {module.items.length} Completed
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {module.items.map((item) => (
                        <div
                          key={item.id}
                          className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                        >
                          <div className="shrink-0">
                            {item.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div
                              className={`p-2 rounded-lg shrink-0 w-fit ${item.type === "Video" ? "bg-brand-blue/10 text-brand-blue" : item.type === "Article" ? "bg-brand-red/10 text-brand-red" : "bg-brand-amber/10 text-brand-amber"}`}
                            >
                              {item.type === "Video" && (
                                <PlayCircle className="w-4 h-4" />
                              )}
                              {item.type === "Article" && (
                                <FileText className="w-4 h-4" />
                              )}
                              {item.type === "Question" && (
                                <Code2 className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p
                                className={`font-medium ${item.completed ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"} group-hover:text-brand-blue transition-colors`}
                              >
                                {item.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                                <span>{item.type}</span>
                                <span>•</span>
                                {item.type === "Question" ? (
                                  <span
                                    className={
                                      item.diff === "Easy"
                                        ? "text-emerald-500"
                                        : item.diff === "Medium"
                                          ? "text-brand-amber"
                                          : "text-brand-red"
                                    }
                                  >
                                    {item.diff}
                                  </span>
                                ) : (
                                  <span>{item.duration}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Link
                            href={
                              item.type === "Question"
                                ? `/classes/${classInfo.id}/sandbox?id=${item.id}`
                                : `/classes/${classInfo.id}/material/${item.id}`
                            }
                            className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-brand-blue transition-colors"
                          >
                            {item.type === "Question"
                              ? "Solve"
                              : item.type === "Video"
                                ? "Watch"
                                : "Read"}
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* QUESTIONS TAB (Newly Updated to Rich UI) */}
            {activeTab === "questions" && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Search Bar */}
                <div className="mb-6 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-100 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search problems by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Sidebar Filters */}
                  <div className="lg:w-64 shrink-0 space-y-6">
                    {/* Difficulty Filter */}
                    <div className="bg-white dark:bg-gray-800/30 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                      <h3 className="font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-brand-blue" />
                        Difficulty
                      </h3>
                      <div className="space-y-2">
                        {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                          <button
                            key={difficulty}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                          >
                            {selectedDifficulty === difficulty ? (
                              <CheckSquare className="w-5 h-5 text-brand-blue" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            )}
                            <span
                              className={`text-sm ${selectedDifficulty === difficulty ? "font-semibold text-brand-blue dark:text-brand-blue" : "text-gray-700 dark:text-gray-300"}`}
                            >
                              {difficulty}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tag Filter */}
                    <div className="bg-white dark:bg-gray-800/30 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                      <h3 className="font-bold text-brand-dark dark:text-white mb-4">
                        Tags
                      </h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {ALL_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                          >
                            {selectedTags.includes(tag) ? (
                              <CheckSquare className="w-5 h-5 text-brand-blue" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            )}
                            <span
                              className={`text-sm ${selectedTags.includes(tag) ? "font-semibold text-brand-blue dark:text-brand-blue" : "text-gray-700 dark:text-gray-300"}`}
                            >
                              {tag}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 px-2">
                      Showing{" "}
                      <span className="font-semibold text-brand-blue">
                        {filteredQuestions.length}
                      </span>{" "}
                      of {classQuestions.length} problems
                    </div>

                    {filteredQuestions.length > 0 ? (
                      <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                          {filteredQuestions.map((question) => (
                            <div
                              key={question.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer p-5 group"
                              onClick={() => handleQuestionClick()}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-start gap-3 mb-2">
                                    <h3 className="font-semibold text-brand-dark dark:text-white text-lg group-hover:text-brand-blue transition-colors">
                                      {question.id}. {question.title}
                                    </h3>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {question.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="text-xs bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                                    <span>
                                      <span className="text-gray-400 dark:text-gray-600">
                                        Acc:
                                      </span>{" "}
                                      {question.acceptance}%
                                    </span>
                                    <span>
                                      <span className="text-gray-400 dark:text-gray-600">
                                        Solved:
                                      </span>{" "}
                                      {question.solved.toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border-2 ${getDifficultyColor(question.difficulty)}`}
                                  >
                                    {question.difficulty}
                                  </span>
                                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-800/30 rounded-xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700 shadow-sm">
                        <Search className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                          No problems found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Try adjusting your search or difficulty tags.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TASKS TAB */}
            {activeTab === "tasks" && (
              <div className="max-w-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Tasks content remains exactly the same */}
              </div>
            )}

            {/* PEOPLE & FEEDBACK TAB */}
            {activeTab === "people" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Left Column: Trainer & Feedback */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Trainer Card */}
                  <div className="bg-white dark:bg-gray-800/30 rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blue to-blue-400 flex items-center justify-center text-white text-3xl font-bold shadow-md shrink-0">
                      {classInfo.trainer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .replace("P", "")}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-2xl font-bold text-brand-dark dark:text-white">
                        {classInfo.trainer.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        {classInfo.trainer.role}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 pt-2 line-clamp-2">
                        I am here to help you master graph theory and ace your
                        technical interviews. Feel free to reach out if you get
                        stuck on any of the Hard difficulty problems!
                      </p>
                    </div>
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0">
                      <MessageSquare className="w-4 h-4" /> Message
                    </button>
                  </div>

                  {/* Feedback History */}
                  <div className="bg-white dark:bg-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-amber fill-brand-amber" />
                      Recent Feedback
                    </h3>

                    <div className="space-y-4">
                      {/* Mock Feedback Item 1 */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          &quot;Great job on the Dijkstra assignment! Your use
                          of the priority queue was perfectly optimized. For the
                          next module, try to focus on edge cases where negative
                          weights exist.&quot;
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {classInfo.trainer.name}
                          </span>
                          <span>•</span>
                          <span>2 days ago</span>
                        </div>
                      </div>

                      {/* Mock Feedback Item 2 */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue rounded-l-xl"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          &quot;Welcome to the class! Make sure to complete the
                          prerequisite sandbox environment setup by Friday so
                          you are ready for the first graded challenge.&quot;
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {classInfo.trainer.name}
                          </span>
                          <span>•</span>
                          <span>1 week ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Classmates */}
                <div className="bg-white dark:bg-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-brand-blue" /> Classmates
                    </h3>
                    <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                      {classInfo.students} total
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      "Alice Johnson",
                      "Bob Smith",
                      "Carol Williams",
                      "David Brown",
                      "Emma Davis",
                      "Frank Lee",
                    ].map((name, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 group-hover:border-brand-blue transition-colors">
                          {name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-brand-blue transition-colors">
                            {name}
                          </span>
                        </div>
                        <div
                          className="w-2 h-2 rounded-full bg-emerald-500"
                          title="Online recently"
                        ></div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 py-2 text-sm text-brand-blue font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    View All Students
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
