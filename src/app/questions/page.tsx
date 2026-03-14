"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  Code2,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  acceptance: number;
  solved: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    acceptance: 47.3,
    solved: 15234,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    acceptance: 32.5,
    solved: 8923,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    acceptance: 33.2,
    solved: 9123,
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Arrays", "Binary Search", "Divide and Conquer"],
    acceptance: 27.4,
    solved: 5234,
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    acceptance: 32.1,
    solved: 7234,
  },
  {
    id: 6,
    title: "ZigZag Conversion",
    difficulty: "Medium",
    tags: ["String"],
    acceptance: 38.5,
    solved: 4123,
  },
  {
    id: 7,
    title: "Reverse Integer",
    difficulty: "Easy",
    tags: ["Math"],
    acceptance: 26.2,
    solved: 8234,
  },
  {
    id: 8,
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    tags: ["String", "Math"],
    acceptance: 15.3,
    solved: 3124,
  },
  {
    id: 9,
    title: "Palindrome Number",
    difficulty: "Easy",
    tags: ["Math"],
    acceptance: 51.8,
    solved: 6234,
  },
  {
    id: 10,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming", "Recursion"],
    acceptance: 26.7,
    solved: 2134,
  },
  {
    id: 11,
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Arrays", "Two Pointers"],
    acceptance: 52.3,
    solved: 9234,
  },
  {
    id: 12,
    title: "Integer to Roman",
    difficulty: "Medium",
    tags: ["String", "Hash Table"],
    acceptance: 63.2,
    solved: 5234,
  },
  {
    id: 13,
    title: "Roman to Integer",
    difficulty: "Easy",
    tags: ["String", "Hash Table"],
    acceptance: 58.4,
    solved: 8234,
  },
  {
    id: 14,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    tags: ["String"],
    acceptance: 38.2,
    solved: 6234,
  },
  {
    id: 15,
    title: "3Sum",
    difficulty: "Medium",
    tags: ["Arrays", "Two Pointers"],
    acceptance: 31.5,
    solved: 7234,
  },
  {
    id: 16,
    title: "3Sum Closest",
    difficulty: "Medium",
    tags: ["Arrays", "Two Pointers"],
    acceptance: 46.2,
    solved: 4123,
  },
  {
    id: 17,
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    tags: ["String", "Backtracking"],
    acceptance: 54.3,
    solved: 5234,
  },
  {
    id: 18,
    title: "4Sum",
    difficulty: "Medium",
    tags: ["Arrays", "Two Pointers", "Sorting"],
    acceptance: 35.2,
    solved: 3234,
  },
  {
    id: 19,
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    tags: ["Linked List", "Two Pointers"],
    acceptance: 35.8,
    solved: 4234,
  },
  {
    id: 20,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    acceptance: 40.2,
    solved: 10234,
  },
  {
    id: 21,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"],
    acceptance: 61.3,
    solved: 9234,
  },
  {
    id: 22,
    title: "Generate Parentheses",
    difficulty: "Medium",
    tags: ["String", "Backtracking", "Dynamic Programming"],
    acceptance: 70.2,
    solved: 8234,
  },
  {
    id: 23,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    tags: ["Linked List", "Divide and Conquer", "Heap"],
    acceptance: 37.2,
    solved: 5234,
  },
  {
    id: 24,
    title: "Swap Nodes in Pairs",
    difficulty: "Medium",
    tags: ["Linked List", "Recursion"],
    acceptance: 58.4,
    solved: 6234,
  },
  {
    id: 25,
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    tags: ["Linked List", "Recursion"],
    acceptance: 46.1,
    solved: 4234,
  },
];

const ALL_TAGS = [
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

export default function Questions() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter((question) => {
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

  const handleQuestionClick = (question: Question) => {
    // navigate(`/sandbox?id=${question.id}`, { state: { question } });
    router.push(`/sandbox?id=${question.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-100 text-emerald-700 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-900/50 dark:border-emerald-700";
      case "Medium":
        return "bg-brand-amber text-brand-dark border-brand-amber dark:text-amber-200/70 dark:bg-amber-500/30 dark:border-amber-500";
      case "Hard":
        return "bg-brand-red text-white border-brand-red c";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-brand-dark dark:text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-brand-blue" />
            Question Bank
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-100 w-5 h-5" />
            <input
              type="text"
              placeholder="Search problems by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all dark:bg-blue-800/10"
            />
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Difficulty Filter */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Difficulty
              </h3>
              <div className="space-y-2">
                {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors text-left"
                  >
                    {selectedDifficulty === difficulty ? (
                      <CheckSquare className="w-5 h-5 text-brand-blue" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                    <span
                      className={`text-sm ${
                        selectedDifficulty === difficulty
                          ? "font-semibold text-brand-blue dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {difficulty}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tag Filter */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-brand-dark dark:text-white mb-4">
                Tags
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors text-left"
                  >
                    {selectedTags.includes(tag) ? (
                      <CheckSquare className="w-5 h-5 text-brand-blue" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                    <span
                      className={`text-sm ${
                        selectedTags.includes(tag)
                          ? "font-semibold text-brand-blue dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Info */}
            <div className="text-sm text-gray-600 dark:text-gray-400 px-2">
              Showing{" "}
              <span className="font-semibold text-brand-blue">
                {filteredQuestions.length}
              </span>{" "}
              of {mockQuestions.length} problems
            </div>
          </div>

          {/* Questions List */}
          <div className="flex-1">
            {filteredQuestions.length > 0 ? (
              <div className="space-y-0">
                {filteredQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer p-5 ${
                      index !== filteredQuestions.length - 1
                        ? "border-b border-gray-200 dark:border-gray-700"
                        : ""
                    }`}
                    onClick={() => handleQuestionClick(question)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                            {question.id}.
                          </span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-brand-dark dark:text-white mb-2">
                              {question.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {question.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded dark:bg-blue-300/10 dark:text-gray-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>
                                <span className="font-medium">Acceptance:</span>{" "}
                                {question.acceptance}%
                              </span>
                              <span>
                                <span className="font-medium">Solved:</span>{" "}
                                {question.solved.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border-2 ${getDifficultyColor(
                            question.difficulty,
                          )}`}
                        >
                          {question.difficulty}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No problems found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
