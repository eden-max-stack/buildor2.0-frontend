"use client";

import Layout from "@/components/Layout";
import { Code2, Lightbulb, Clock, Play, Eye, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface Question {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  acceptance: number;
  solved: number;
}

interface GraphData {
  ast: any;
  cfg: any;
  dfg: any;
  source_code: string;
}

const allProblems: Question[] = [
  { id: 1, title: "Two Sum", difficulty: "Easy", tags: ["Arrays", "Hash Table"], acceptance: 47.3, solved: 15234 },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium", tags: ["Linked List", "Math"], acceptance: 32.5, solved: 8923 },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", tags: ["Hash Table", "String", "Sliding Window"], acceptance: 33.2, solved: 9123 },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", tags: ["Arrays", "Binary Search", "Divide and Conquer"], acceptance: 27.4, solved: 5234 },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", tags: ["String", "Dynamic Programming"], acceptance: 32.1, solved: 7234 },
];

const problemDescriptions: Record<number, { description: string; examples: string; constraints: string }> = {
  1: {
    description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to the target.",
    examples: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
    constraints: "2 ≤ nums.length ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9",
  },
};

const mockHints = [
  "Try using a two-pointer approach for this problem.",
  "Consider using a hash map to store intermediate results.",
  "Think about the edge cases: empty arrays, single element, and duplicates.",
];

export default function CodeSandbox() {
  const searchParams = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(300);
  const [hintRequested, setHintRequested] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState(`def example(x):\n    y = x + 1\n    if x > 0:\n        z = y * 2\n        print(z)\n    else:\n        z = y * 3\n        print(z)\n    result = z + y\n    return result`);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visualizationData, setVisualizationData] = useState<GraphData | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [activeTab, setActiveTab] = useState<'ast' | 'cfg' | 'dfg'>('cfg');

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

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running code...");
    
    setTimeout(() => {
      setOutput("Test Case 1: Passed ✓\nTest Case 2: Passed ✓\nTest Case 3: Failed ✗\n\nExpected: [0, 1]\nReceived: [1, 0]");
      setIsRunning(false);
    }, 1500);
  };

  const handleVisualize = async () => {
    setIsVisualizing(true);
    setOutput("Generating visualization...");

    try {
      const response = await fetch('http://localhost:8000/api/v1/graph/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source_code: code })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVisualizationData(data);
      setShowVisualization(true);
      setOutput("✓ Visualization generated successfully!");
    } catch (error) {
      setOutput(`Error generating visualization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsVisualizing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Left Panel - Problem Statement */}
          <div className="lg:col-span-1 bg-white border border-gray-200 dark:bg-blue-700/10 dark:border-blue-500/20 rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-brand-dark mb-2 dark:text-gray-100">
                {question?.title || "Code Visualization"}
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
                <h3 className="font-semibold text-brand-dark mb-2 dark:text-gray-200">Description:</h3>
                <p className="dark:text-gray-400">
                  Write your Python code in the editor and click "Visualize" to see the AST, CFG, and DFG representations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Editor and Output */}
          <div className="lg:col-span-2 space-y-6">
            {/* Code Editor */}
            <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-200 font-bold">Code Editor</span>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded font-semibold transition-all ${
                      isRunning
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    {isRunning ? "Running..." : "Run"}
                  </button>
                  
                  <button
                    onClick={handleVisualize}
                    disabled={isVisualizing}
                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded font-semibold transition-all ${
                      isVisualizing
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    {isVisualizing ? "Visualizing..." : "Visualize"}
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-gray-900 text-white p-6 font-mono text-sm focus:outline-none resize-none"
                spellCheck={false}
              />
            </div>

            {/* Output Section */}
            <div className="bg-gray-50 border border-gray-300 dark:bg-gray-800/50 dark:border-blue-600/10 rounded-lg overflow-hidden">
              <div className="bg-gray-200 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
                <h3 className="font-bold text-brand-dark dark:text-gray-200 text-sm">Output</h3>
              </div>
              <div className="p-6">
                {output ? (
                  <pre className="text-gray-700 dark:text-gray-300 text-sm font-mono whitespace-pre-wrap">
                    {output}
                  </pre>
                ) : (
                  <p className="text-gray-500 text-sm dark:text-gray-400">
                    Run your code to see output here
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visualization Section */}
        {showVisualization && visualizationData && (
          <div className="mb-12 bg-white dark:bg-gray-800 border-2 border-blue-500/30 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-white" />
                <h3 className="font-bold text-white text-lg">Code Visualization</h3>
              </div>
              <button
                onClick={() => setShowVisualization(false)}
                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('ast')}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  activeTab === 'ast'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                }`}
              >
                AST
              </button>
              <button
                onClick={() => setActiveTab('cfg')}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  activeTab === 'cfg'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                }`}
              >
                CFG
              </button>
              <button
                onClick={() => setActiveTab('dfg')}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  activeTab === 'dfg'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                }`}
              >
                DFG
              </button>
            </div>

            {/* Graph Display */}
            <div className="p-6 bg-white dark:bg-gray-900">
              {activeTab === 'ast' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">AST Statistics</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Total Nodes: {visualizationData.ast.node_count}
                    </p>
                  </div>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs overflow-auto max-h-96 text-gray-900 dark:text-gray-100">
                    {JSON.stringify(visualizationData.ast, null, 2)}
                  </pre>
                </div>
              )}

              {activeTab === 'cfg' && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">CFG Statistics</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Nodes:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                          {visualizationData.cfg.nodes.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Edges:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                          {visualizationData.cfg.edges.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Entry ID:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                          {visualizationData.cfg.entry_id}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Nodes</h5>
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs space-y-2 max-h-96 overflow-auto">
                        {visualizationData.cfg.nodes.map((node: any) => (
                          <div key={node.id} className="border-l-4 border-blue-500 pl-2 py-1">
                            <span className="font-bold text-blue-600 dark:text-blue-400">[{node.id}]</span>{' '}
                            <span className="text-gray-900 dark:text-gray-100">{node.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Edges</h5>
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs space-y-2 max-h-96 overflow-auto">
                        {visualizationData.cfg.edges.map((edge: any, idx: number) => (
                          <div key={idx} className="text-gray-700 dark:text-gray-300">
                            <span className="font-bold text-green-600 dark:text-green-400">{edge.source}</span> → 
                            <span className="font-bold text-green-600 dark:text-green-400"> {edge.target}</span>
                            {edge.condition && (
                              <span className="ml-2 text-purple-600 dark:text-purple-400">
                                [{edge.condition}]
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dfg' && (
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">DFG Statistics</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Nodes:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                          {visualizationData.dfg.nodes.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Variables:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                          {Object.keys(visualizationData.dfg.definitions).length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Data Flows:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                          {visualizationData.dfg.edges.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Definitions</h5>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-sm space-y-2 max-h-96 overflow-auto">
                        {visualizationData.dfg.nodes
                          .filter((node: any) => node.is_definition)
                          .map((node: any) => (
                            <div key={node.id} className="border-l-4 border-green-500 pl-2 py-1">
                              <span className="font-bold text-green-600 dark:text-green-400">[{node.id}]</span>{' '}
                              <span className="font-mono text-gray-900 dark:text-gray-100">{node.variable}</span> :=
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Uses</h5>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded text-sm space-y-2 max-h-96 overflow-auto">
                        {visualizationData.dfg.nodes
                          .filter((node: any) => !node.is_definition)
                          .map((node: any) => (
                            <div key={node.id} className="border-l-4 border-orange-500 pl-2 py-1">
                              <span className="font-bold text-orange-600 dark:text-orange-400">[{node.id}]</span>{' '}
                              <span className="font-mono text-gray-900 dark:text-gray-100">{node.variable}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Data Flow Edges</h5>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm space-y-2 max-h-64 overflow-auto">
                      {visualizationData.dfg.edges.map((edge: any, idx: number) => (
                        <div key={idx} className="text-gray-700 dark:text-gray-300">
                          <span className="font-bold text-purple-600 dark:text-purple-400">[{edge.source}]</span>{' '}
                          <span className="font-mono text-gray-900 dark:text-gray-100">{edge.variable}</span> →{' '}
                          <span className="font-bold text-purple-600 dark:text-purple-400">[{edge.target}]</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hint Section */}
        <div className="bg-gradient-to-r from-brand-amber/10 to-brand-red/10 border-2 border-brand-amber/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-brand-amber flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-brand-dark mb-3 text-lg dark:text-gray-200">Need a Hint?</h3>

              {hintRequested ? (
                <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-brand-amber dark:bg-gray-800">
                  <p className="text-gray-700 dark:text-gray-300">{mockHints[currentHintIndex]}</p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Click below to reveal hints for solving this problem.
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