"use client"

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Search, Filter } from "lucide-react";
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
        selectedDifficulty === "All" || question.difficulty === selectedDifficulty;

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => question.tags.includes(tag));

      return matchesSearch && matchesDifficulty && matchesTags;
    });
  }, [searchQuery, selectedDifficulty, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-brand-dark dark:text-white mb-4">
            Question Bank
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Practice data structures and algorithms with {mockQuestions.length} problems.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
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

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-3 flex items-center gap-2 dark:text-gray-100">
              <Filter className="w-4 h-4" />
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedDifficulty === difficulty
                      ? "bg-brand-blue text-white border-2 border-brand-blue dark:bg-blue-600/70"
                      : "border-2 border-gray-300 text-gray-700 hover:border-brand-blue dark:text-gray-100 dark:border-gray-700 hover:dark:border-blue-600"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-semibold text-brand-dark dark:text-gray-200 mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-brand-blue text-white dark:bg-blue-600/70"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-blue-300/10 dark:text-gray-400 hover:dark:bg-blue-700/20"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 text-sm text-gray-600">
          Showing {filteredQuestions.length} of {mockQuestions.length} problems
          {selectedTags.length > 0 && ` • ${selectedTags.join(", ")}`}
        </div>

        {/* Problems Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200 dark:bg-blue-900/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark w-1/2 dark:text-white">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark w-1/6 dark:text-white">
                  Difficulty
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark dark:text-white">
                  Acceptance
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark dark:text-white">
                  Solved
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-brand-dark dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <tr
                    key={question.id}
                    className="border-b border-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700/10 transition-colors cursor-pointer"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <p className="font-semibold text-brand-dark dark:text-gray-400">
                          {question.id}. {question.title}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {question.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded dark:bg-blue-300/10 dark:text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border-2 ${getDifficultyColor(
                          question.difficulty
                        )}`}
                      >
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-400 font-medium">
                      {question.acceptance}%
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {question.solved.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuestionClick(question);
                        }}
                        className="text-brand-blue hover:text-blue-600 font-semibold transition-colors dark:text-blue-400/100 dark:hover:text-blue-800"
                      >
                        Solve
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg font-medium">No problems found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop View Note */}
        <div className="mt-8 text-sm text-gray-500 text-center">
          💡 Scroll horizontally on mobile to see all columns
        </div>
      </div>
    </Layout>
  );
}
