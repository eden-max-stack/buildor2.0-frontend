"use client";

import Layout from "@/components/Layout";
import { Code2, Lightbulb, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Question {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  acceptance: number;
  solved: number;
}

const allProblems: Question[] = [
  { id: 1, title: "Two Sum", difficulty: "Easy", tags: ["Arrays", "Hash Table"], acceptance: 47.3, solved: 15234 },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium", tags: ["Linked List", "Math"], acceptance: 32.5, solved: 8923 },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", tags: ["Hash Table", "String", "Sliding Window"], acceptance: 33.2, solved: 9123 },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", tags: ["Arrays", "Binary Search", "Divide and Conquer"], acceptance: 27.4, solved: 5234 },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", tags: ["String", "Dynamic Programming"], acceptance: 32.1, solved: 7234 },
  { id: 6, title: "ZigZag Conversion", difficulty: "Medium", tags: ["String"], acceptance: 38.5, solved: 4123 },
  { id: 7, title: "Reverse Integer", difficulty: "Easy", tags: ["Math"], acceptance: 26.2, solved: 8234 },
  { id: 8, title: "String to Integer (atoi)", difficulty: "Medium", tags: ["String", "Math"], acceptance: 15.3, solved: 3124 },
  { id: 9, title: "Palindrome Number", difficulty: "Easy", tags: ["Math"], acceptance: 51.8, solved: 6234 },
  { id: 10, title: "Regular Expression Matching", difficulty: "Hard", tags: ["String", "Dynamic Programming", "Recursion"], acceptance: 26.7, solved: 2134 },
  { id: 11, title: "Container With Most Water", difficulty: "Medium", tags: ["Arrays", "Two Pointers"], acceptance: 52.3, solved: 9234 },
  { id: 12, title: "Integer to Roman", difficulty: "Medium", tags: ["String", "Hash Table"], acceptance: 63.2, solved: 5234 },
  { id: 13, title: "Roman to Integer", difficulty: "Easy", tags: ["String", "Hash Table"], acceptance: 58.4, solved: 8234 },
  { id: 14, title: "Longest Common Prefix", difficulty: "Easy", tags: ["String"], acceptance: 38.2, solved: 6234 },
  { id: 15, title: "3Sum", difficulty: "Medium", tags: ["Arrays", "Two Pointers"], acceptance: 31.5, solved: 7234 },
  { id: 16, title: "3Sum Closest", difficulty: "Medium", tags: ["Arrays", "Two Pointers"], acceptance: 46.2, solved: 4123 },
  { id: 17, title: "Letter Combinations of a Phone Number", difficulty: "Medium", tags: ["String", "Backtracking"], acceptance: 54.3, solved: 5234 },
  { id: 18, title: "4Sum", difficulty: "Medium", tags: ["Arrays", "Two Pointers", "Sorting"], acceptance: 35.2, solved: 3234 },
  { id: 19, title: "Remove Nth Node From End of List", difficulty: "Medium", tags: ["Linked List", "Two Pointers"], acceptance: 35.8, solved: 4234 },
  { id: 20, title: "Valid Parentheses", difficulty: "Easy", tags: ["String", "Stack"], acceptance: 40.2, solved: 10234 },
  { id: 21, title: "Merge Two Sorted Lists", difficulty: "Easy", tags: ["Linked List", "Recursion"], acceptance: 61.3, solved: 9234 },
  { id: 22, title: "Generate Parentheses", difficulty: "Medium", tags: ["String", "Backtracking", "Dynamic Programming"], acceptance: 70.2, solved: 8234 },
  { id: 23, title: "Merge k Sorted Lists", difficulty: "Hard", tags: ["Linked List", "Divide and Conquer", "Heap"], acceptance: 37.2, solved: 5234 },
  { id: 24, title: "Swap Nodes in Pairs", difficulty: "Medium", tags: ["Linked List", "Recursion"], acceptance: 58.4, solved: 6234 },
  { id: 25, title: "Reverse Nodes in k-Group", difficulty: "Hard", tags: ["Linked List", "Recursion"], acceptance: 46.1, solved: 4234 },
];

const problemDescriptions: Record<number, { description: string; examples: string; constraints: string }> = {
  1: {
    description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to the target.",
    examples: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
    constraints: "2 ≤ nums.length ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9",
  },
  2: {
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: "Input: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]",
    constraints: "The number of nodes in each linked list is in the range [1, 100]\n0 ≤ Node.val ≤ 9",
  },
  3: {
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: "Input: s = \"abcabcbb\"\nOutput: 3 (\"abc\")",
    constraints: "0 ≤ s.length ≤ 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
  },
};

const mockHints = [
  "Try using a two-pointer approach for this problem.",
  "Consider using a hash map to store intermediate results.",
  "Think about the edge cases: empty arrays, single element, and duplicates.",
  "You might need to use dynamic programming to optimize the solution.",
  "Check if the problem requires sorting first.",
];

export default function CodeSandbox() {
  const searchParams = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [hintRequested, setHintRequested] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const questionId = parseInt(searchParams?.get("id") || "0");
    if (questionId > 0) {
      const foundProblem = allProblems.find((p) => p.id === questionId);
      if (foundProblem) setQuestion(foundProblem);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleGetHint = () => {
    setHintRequested(true);
    setCurrentHintIndex((prev) => (prev + 1) % mockHints.length);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Code Sandbox Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Left Panel - Problem Statement */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-brand-dark mb-2">
                {question?.title || "Loading..."}
              </h2>
              {question && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border-2 ${
                  question.difficulty === "Easy"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                    : question.difficulty === "Medium"
                    ? "bg-brand-amber text-brand-dark border-brand-amber"
                    : "bg-brand-red text-white border-brand-red"
                }`}>
                  {question.difficulty}
                </span>
              )}
            </div>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-brand-dark mb-2">Description:</h3>
                <p>
                  {question ? (problemDescriptions[question.id] || "Problem description not available") && problemDescriptions[question.id]?.description : "Select a problem to view details"}
                </p>
              </div>
              {question && problemDescriptions[question.id] && (
                <>
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-2">Examples:</h3>
                    <code className="block bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
                      {problemDescriptions[question.id].examples}
                    </code>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-2">Constraints:</h3>
                    <code className="block bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
                      {problemDescriptions[question.id].constraints}
                    </code>
                  </div>
                </>
              )}
              {question && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Acceptance:</span> {question.acceptance}% •
                    <span className="font-semibold ml-2">Solved:</span> {question.solved.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Editor and Output */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Section */}
            <div className="bg-gradient-to-r from-brand-blue/5 to-brand-amber/5 border-2 border-brand-blue/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brand-blue" />
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                      Hint Cooldown Timer
                    </p>
                    <p className="text-3xl font-bold text-brand-blue">
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {timeLeft === 0 ? (
                    <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                      ✓ Ready for Hints
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600">
                      Waiting for cooldown to end
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Code Editor Placeholder */}
            <div className="bg-gray-900 text-white rounded-lg p-6 font-mono text-sm">
              <div className="space-y-2">
                <p>
                  <span className="text-blue-400">function</span>{" "}
                  <span className="text-yellow-300">twoSum</span>
                  <span className="text-gray-300">(nums, target) {"{"}</span>
                </p>
                <p className="pl-4 text-gray-500">// Write your solution here</p>
                <p>
                  <span className="text-gray-300">{"}"}</span>
                </p>
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <h3 className="font-bold text-brand-dark mb-4">Output</h3>
              <p className="text-gray-500 text-sm">Run your code to see output here</p>
            </div>
          </div>
        </div>

        {/* Hint Section */}
        <div className="bg-gradient-to-r from-brand-amber/10 to-brand-red/10 border-2 border-brand-amber/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-brand-amber flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-brand-dark mb-3 text-lg">Need a Hint?</h3>

              {hintRequested ? (
                <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-brand-amber">
                  <p className="text-gray-700">{mockHints[currentHintIndex]}</p>
                </div>
              ) : (
                <p className="text-gray-600 mb-4">
                  Wait for the cooldown timer above to finish, then click the button below
                  to reveal hints for solving this problem.
                </p>
              )}

              <button
                onClick={handleGetHint}
                disabled={timeLeft > 0}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                  timeLeft > 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                    : "bg-brand-amber text-brand-dark hover:bg-amber-500 active:scale-95"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                {timeLeft > 0 ? "Hint Available in " + formatTime(timeLeft) : "Get Hint"}
              </button>

              {hintRequested && (
                <button
                  onClick={() =>
                    setCurrentHintIndex((prev) => (prev + 1) % mockHints.length)
                  }
                  className="ml-3 px-4 py-2 border-2 border-brand-amber text-brand-amber rounded-lg font-semibold hover:bg-brand-amber/5 transition-colors"
                >
                  Next Hint
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
