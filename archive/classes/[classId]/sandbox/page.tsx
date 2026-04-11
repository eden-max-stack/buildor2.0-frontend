/* eslint-disable */

"use client";

import Layout from "@/components/Layout";
import {
  Code2,
  Lightbulb,
  Clock,
  Play,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Check,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef, type RefObject } from "react";
import { useSearchParams } from "next/navigation";
import * as d3 from "d3";
import { createClient } from "@/lib/supabase/client";

// ============================================
// TYPES & INTERFACES
// ============================================

interface TestCase {
  id: string;
  input: Record<string, any>;
  expected_output: any;
  is_sample: boolean;
  is_hidden: boolean;
  difficulty?: string;
  order_index: number;
}

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  constraints: string[];
  acceptance_rate?: number;
  total_submissions: number;
  successful_submissions: number;
  optimal_solution?: string;
  time_complexity?: string;
  space_complexity?: string;
  test_cases: TestCase[];
}

interface TestCaseResult {
  test_case_id: string;
  passed: boolean;
  input: Record<string, any>;
  expected_output: any;
  actual_output?: any;
  error_message?: string;
  is_sample: boolean;
}

interface SubmissionResult {
  id: string;
  question_id: string;
  user_id: string;
  status: "accepted" | "wrong_answer" | "runtime_error" | "time_limit_exceeded";
  test_cases_passed: number;
  total_test_cases: number;
  runtime_ms?: number;
  memory_kb?: number;
  test_results: TestCaseResult[];
  error_message?: string;
  submitted_at: string;
}

interface HintData {
  hint: string;
  analysis?: {
    bug_type: string;
    confidence: number;
    bug_line?: number;
    patch_suggestion?: string;
  };
  hints_used: number;
}

interface FunctionAnalysis {
  name: string;
  ast_node_id: number;
  cfg: any;
  dfg: any;
}

interface GraphData {
  ast: any;
  functions: FunctionAnalysis[];
  source_code: string;
  error?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CodeSandbox() {
  const searchParams = useSearchParams();
  const API_BASE = "http://localhost:8000";
  const supabase = createClient();

  // Question state
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Code editor state
  const [code, setCode] = useState(`def solution(nums, target):
    # Write your solution here
    pass`);

  // Submission state
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hint state
  const [hintData, setHintData] = useState<HintData | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Visualization state
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visualizationData, setVisualizationData] = useState<GraphData | null>(
    null,
  );
  const [showVisualization, setShowVisualization] = useState(false);
  const [activeTab, setActiveTab] = useState<"ast" | "cfg" | "dfg">("cfg");
  const [selectedFunctionIndex, setSelectedFunctionIndex] = useState<number>(0);
  const [showFunctionSelector, setShowFunctionSelector] = useState(false);

  const astSvgRef = useRef<SVGSVGElement | null>(null);
  const cfgSvgRef = useRef<SVGSVGElement | null>(null);
  const dfgSvgRef = useRef<SVGSVGElement | null>(null);

  // ============================================
  // FETCH QUESTION DETAILS
  // ============================================

  useEffect(() => {
    const questionId = searchParams?.get("id");
    if (questionId) {
      fetchQuestionDetails(questionId);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id ?? null);
    };
    loadCurrentUser();
  }, []);

  const fetchQuestionDetails = async (questionId: string) => {
    setIsLoadingQuestion(true);
    try {
      const response = await fetch(`${API_BASE}/questions/${questionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.status}`);
      }
      const data = await response.json();
      // Normalize constraints: backend returns string or null, frontend expects string[]
      if (typeof data.constraints === "string") {
        data.constraints = data.constraints.split("\n").filter(Boolean);
      } else if (!Array.isArray(data.constraints)) {
        data.constraints = [];
      }
      // Normalize test_cases
      if (!Array.isArray(data.test_cases)) {
        data.test_cases = [];
      }
      setQuestion(data);

      // Set initial code template if available
      if (data.test_cases.length > 0) {
        const firstTestCase = data.test_cases[0];
        const params = Object.keys(firstTestCase.input).join(", ");
        setCode(`def solution(${params}):
    # Write your solution here
    pass`);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      alert("Failed to load question. Please try again.");
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // ============================================
  // SUBMIT CODE
  // ============================================

  const handleSubmitCode = async () => {
    if (!question) return;
    if (!currentUserId) {
      alert("You must be signed in to submit code.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const response = await fetch(`${API_BASE}/submissions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_id: question.id,
          user_id: currentUserId,
          code: code,
          language: "python",
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      const result: SubmissionResult = await response.json();
      setSubmissionResult(result);
    } catch (error) {
      console.error("Error submitting code:", error);
      alert("Failed to submit code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // GET HINT
  // ============================================

  const handleGetHint = async () => {
    if (!question) return;
    if (!currentUserId) {
      alert("You must be signed in to get hints.");
      return;
    }

    setIsLoadingHint(true);

    try {
      const response = await fetch(`${API_BASE}/analysis/hint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_id: question.id,
          user_id: currentUserId,
          user_code: code,
          skill_level: "medium",
        }),
      });

      if (!response.ok) {
        throw new Error(`Hint request failed: ${response.status}`);
      }

      const hint: HintData = await response.json();
      setHintData(hint);
    } catch (error) {
      console.error("Error getting hint:", error);
      alert("Failed to get hint. Please try again.");
    } finally {
      setIsLoadingHint(false);
    }
  };

  // ============================================
  // VISUALIZE CODE
  // ============================================

  const handleVisualize = async () => {
    setIsVisualizing(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/graph/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source_code: code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVisualizationData(data);
      setShowVisualization(true);
      setSelectedFunctionIndex(0);
    } catch (error) {
      console.error("Error generating visualization:", error);
      alert("Failed to generate visualization. Please check your code syntax.");
    } finally {
      setIsVisualizing(false);
    }
  };

  // ============================================
  // VISUALIZATION HELPERS
  // ============================================

  const getCurrentFunction = () => {
    if (!visualizationData?.functions?.length) return null;
    return visualizationData.functions[selectedFunctionIndex];
  };

  // D3.js visualization functions
  const renderAST = (astData: any, svgRef: RefObject<SVGSVGElement | null>) => {
    if (!svgRef.current || !astData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 600;

    // Set SVG dimensions explicitly
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g");

    // Create tree layout with proper spacing
    const treeLayout = d3
      .tree<any>()
      .size([width - 100, height - 100])
      .separation((a, b) => (a.parent === b.parent ? 3 : 4));

    // Convert AST to d3 hierarchy
    const root = d3.hierarchy(astData.root, (d: any) => d.children);
    const treeData = treeLayout(root);

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom as any);

    // Draw links
    g.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkVertical<any, any>()
          .x((d: any) => d.x)
          .y((d: any) => d.y) as any,
      )
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2);

    // Draw nodes
    const node = g
      .selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

    node
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d: any) => {
        if (d.data.type === "function_definition") return "#3b82f6";
        if (d.data.type === "if_statement") return "#10b981";
        if (d.data.type === "assignment") return "#f59e0b";
        return "#6366f1";
      })
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1.5);

    node
      .append("text")
      .attr("x", 0)
      .attr("y", -16)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "auto")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("fill", "#1e293b")
      .attr("pointer-events", "none")
      .text((d: any) => {
        const t: string = d.data.type || "";
        return t.length > 13 ? t.slice(0, 12) + "…" : t;
      });

    // Center the tree with better calculation
    const bounds = (g.node() as SVGGElement | null)?.getBBox();
    if (bounds && bounds.width > 0 && bounds.height > 0) {
      const fullWidth = width;
      const fullHeight = height;
      const midX = bounds.x + bounds.width / 2;
      const midY = bounds.y + bounds.height / 2;
      const scale = Math.min(
        0.9,
        fullWidth / bounds.width,
        fullHeight / bounds.height,
      );

      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform as any,
          d3.zoomIdentity
            .translate(fullWidth / 2, fullHeight / 2)
            .scale(scale)
            .translate(-midX, -midY),
        );
    } else {
      // Default centering if bounds calculation fails
      svg.call(
        zoom.transform as any,
        d3.zoomIdentity.translate(width / 2, 50).scale(0.8),
      );
    }
  };

  const renderCFG = (cfgData: any, svgRef: RefObject<SVGSVGElement | null>) => {
    if (!svgRef.current || !cfgData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 400;

    const g = svg.append("g");

    // Create force simulation
    const simulation = d3
      .forceSimulation(cfgData.nodes)
      .force(
        "link",
        d3
          .forceLink(cfgData.edges)
          .id((d: any) => d.id)
          .distance(200),
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(70));

    // Add zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom as any);

    // Draw edges
    const link = g
      .selectAll(".link")
      .data(cfgData.edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    // Add arrowhead marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#94a3b8");

    // Draw nodes
    const node = g
      .selectAll(".node")
      .data(cfgData.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag<SVGGElement, any>()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any,
      );

    node
      .append("rect")
      .attr("width", 100)
      .attr("height", 50)
      .attr("x", -50)
      .attr("y", -25)
      .attr("rx", 5)
      .attr("fill", (d: any) => {
        if (d.label === "ENTRY") return "#10b981";
        if (d.label === "EXIT") return "#ef4444";
        return "#3b82f6";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .text((d: any) => d.label);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
  };

  const renderDFG = (dfgData: any, svgRef: RefObject<SVGSVGElement | null>) => {
    if (!svgRef.current || !dfgData || dfgData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 400;

    const g = svg.append("g");

    // Create force simulation
    const simulation = d3
      .forceSimulation(dfgData.nodes)
      .force(
        "link",
        d3
          .forceLink(dfgData.edges)
          .id((d: any) => d.id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Add zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom as any);

    // Draw edges
    const link = g.selectAll(".link").data(dfgData.edges).enter().append("g");

    link
      .append("line")
      .attr("stroke", "#a855f7")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead-dfg)");

    // Add arrowhead marker for DFG
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-dfg")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#a855f7");

    // Draw nodes
    const node = g
      .selectAll(".node")
      .data(dfgData.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag<SVGGElement, any>()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any,
      );

    node
      .append("circle")
      .attr("r", 30)
      .attr("fill", (d: any) => (d.is_definition ? "#10b981" : "#f97316"))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .text((d: any) => d.variable);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .select("line")
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
  };

  // Render visualizations when data changes
  useEffect(() => {
    if (!visualizationData || !showVisualization) return;
    const currentFunction = getCurrentFunction();

    if (activeTab === "ast" && visualizationData.ast) {
      renderAST(visualizationData.ast, astSvgRef);
    } else if (activeTab === "cfg" && currentFunction?.cfg) {
      renderCFG(currentFunction.cfg, cfgSvgRef);
    } else if (activeTab === "dfg" && currentFunction?.dfg) {
      renderDFG(currentFunction.dfg, dfgSvgRef);
    }
  }, [visualizationData, activeTab, showVisualization, selectedFunctionIndex]);

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "Medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Hard":
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "wrong_answer":
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      case "runtime_error":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // ============================================
  // RENDER
  // ============================================

  if (isLoadingQuestion) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading question...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!question) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Question not found
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const currentFunction = getCurrentFunction();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* --- SECURITY NOTICE BANNER --- */}
        <div className="bg-brand-amber/10 border border-brand-amber/30 rounded-xl p-5 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-brand-amber shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-brand-dark dark:text-amber-200 text-base">
              Sandbox Execution Disabled
            </h3>
            <p className="text-sm text-gray-700 dark:text-amber-100/70 mt-1.5 leading-relaxed">
              This interactive code execution feature has not been fully
              activated yet. We are currently incorporating critical security
              patches into the backend isolated environment before it can be
              safely deployed for live code execution. The interface below is a
              visual preview.
            </p>
          </div>
        </div>
        {/* ------------------------------ */}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark dark:text-white mb-2">
              {question.title}
            </h1>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(question.difficulty)}`}
              >
                {question.difficulty}
              </span>
              {question.acceptance_rate && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Acceptance: {question.acceptance_rate.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Problem Description */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
            {/* Tags */}
            <div>
              <h3 className="font-semibold text-brand-dark dark:text-gray-200 mb-2">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-brand-dark dark:text-gray-200 mb-2">
                Description:
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                {question.description}
              </p>
            </div>

            {/* Constraints */}
            {question.constraints.length > 0 && (
              <div>
                <h3 className="font-semibold text-brand-dark dark:text-gray-200 mb-2">
                  Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {question.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sample Test Cases */}
            {question.test_cases.filter((tc) => tc.is_sample).length > 0 && (
              <div>
                <h3 className="font-semibold text-brand-dark dark:text-gray-200 mb-2">
                  Examples:
                </h3>
                <div className="space-y-3">
                  {question.test_cases
                    .filter((tc) => tc.is_sample)
                    .map((tc, idx) => (
                      <div
                        key={tc.id}
                        className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm"
                      >
                        <div className="font-mono">
                          <div className="text-gray-600 dark:text-gray-400">
                            Input:
                          </div>
                          <div className="text-gray-900 dark:text-gray-100 ml-2">
                            {JSON.stringify(tc.input, null, 2)}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 mt-2">
                            Output:
                          </div>
                          <div className="text-gray-900 dark:text-gray-100 ml-2">
                            {JSON.stringify(tc.expected_output)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Complexity */}
            {(question.time_complexity || question.space_complexity) && (
              <div>
                <h3 className="font-semibold text-brand-dark dark:text-gray-200 mb-2">
                  Complexity:
                </h3>
                <div className="text-sm space-y-1">
                  {question.time_complexity && (
                    <div className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Time:</span>{" "}
                      {question.time_complexity}
                    </div>
                  )}
                  {question.space_complexity && (
                    <div className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Space:</span>{" "}
                      {question.space_complexity}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Editor and Output */}
          <div className="lg:col-span-2 space-y-6">
            {/* Code Editor */}
            <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-200 font-bold">
                  Code Editor
                </span>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSubmitCode}
                    disabled={isSubmitting}
                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded font-semibold transition-all ${
                      isSubmitting
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    {isSubmitting ? "Submitting..." : "Submit"}
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
                className="w-full h-96 bg-gray-900 text-white p-6 font-mono text-sm focus:outline-none resize-none"
                spellCheck={false}
                placeholder="Write your solution here..."
              />
            </div>

            {/* Submission Results */}
            {submissionResult && (
              <div
                className={`border-2 rounded-lg p-6 ${
                  submissionResult.status === "accepted"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                    : "bg-red-50 dark:bg-red-900/20 border-red-500"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {submissionResult.status === "accepted" ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">
                        <span
                          className={`${getStatusColor(submissionResult.status)}`}
                        >
                          {submissionResult.status
                            .replace("_", " ")
                            .toUpperCase()}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {submissionResult.test_cases_passed} /{" "}
                        {submissionResult.total_test_cases} test cases passed
                      </p>
                    </div>
                  </div>
                  {submissionResult.runtime_ms !== undefined && (
                    <div className="text-right text-sm">
                      <div className="text-gray-700 dark:text-gray-300">
                        Runtime:{" "}
                        <span className="font-semibold">
                          {submissionResult.runtime_ms}ms
                        </span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        Memory:{" "}
                        <span className="font-semibold">
                          {(submissionResult.memory_kb! / 1024).toFixed(2)}MB
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {submissionResult.error_message && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                    <p className="text-sm font-mono text-red-800 dark:text-red-300">
                      {submissionResult.error_message}
                    </p>
                  </div>
                )}

                {/* Test Results */}
                <div className="space-y-2">
                  {submissionResult.test_results
                    .filter((tr) => tr.is_sample)
                    .map((result, idx) => (
                      <div
                        key={result.test_case_id}
                        className={`p-3 rounded border ${
                          result.passed
                            ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
                            : "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">
                            Test Case {idx + 1}
                          </span>
                          {result.passed ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="text-xs font-mono space-y-1">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Input:
                            </span>{" "}
                            <span className="text-gray-900 dark:text-gray-100">
                              {JSON.stringify(result.input)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Expected:
                            </span>{" "}
                            <span className="text-gray-900 dark:text-gray-100">
                              {JSON.stringify(result.expected_output)}
                            </span>
                          </div>
                          {result.actual_output !== undefined && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">
                                Got:
                              </span>{" "}
                              <span
                                className={
                                  result.passed
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-red-700 dark:text-red-300"
                                }
                              >
                                {JSON.stringify(result.actual_output)}
                              </span>
                            </div>
                          )}
                          {result.error_message && (
                            <div className="text-red-700 dark:text-red-300">
                              Error: {result.error_message}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hint Section */}
        <div className="bg-gradient-to-r from-brand-amber/10 to-brand-red/10 border-2 border-brand-amber/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-brand-amber flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-brand-dark mb-3 text-lg dark:text-gray-200">
                Need a Hint?
                {hintData && (
                  <span className="ml-3 text-sm font-normal text-gray-600 dark:text-gray-400">
                    ({hintData.hints_used} hints used)
                  </span>
                )}
              </h3>

              {hintData ? (
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start gap-3">
                    <div className="flex-1 bg-white rounded-lg p-4 border-l-4 border-brand-amber dark:bg-gray-800">
                      <p className="text-gray-700 dark:text-gray-300">
                        {hintData.hint}
                      </p>
                    </div>

                    {hintData.analysis && (
                      <div className="md:w-56 bg-white/60 dark:bg-gray-900/40 border border-brand-amber/30 rounded-lg p-3">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
                              Bug Type
                            </span>
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200">
                              {hintData.analysis.bug_type}
                            </span>
                          </div>

                          {hintData.analysis.bug_line !== undefined &&
                            hintData.analysis.bug_line !== null && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
                                  Line
                                </span>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                                  {hintData.analysis.bug_line}
                                </span>
                              </div>
                            )}

                          {typeof hintData.analysis.confidence === "number" && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
                                Confidence
                              </span>
                              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                                {(hintData.analysis.confidence * 100).toFixed(
                                  1,
                                )}
                                %
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Click below to get an AI-powered hint for solving this
                  problem.
                </p>
              )}

              <button
                onClick={handleGetHint}
                disabled={isLoadingHint}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                  isLoadingHint
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                    : "bg-brand-amber text-brand-dark hover:bg-amber-500 active:scale-95"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                {isLoadingHint ? "Generating Hint..." : "Get Hint"}
              </button>
            </div>
          </div>
        </div>

        {/* Visualization Section */}
        {showVisualization && visualizationData && (
          <div className="mb-12 bg-white dark:bg-gray-800 border-2 border-blue-500/30 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-white" />
                <h3 className="font-bold text-white text-lg">
                  Code Visualization
                </h3>
              </div>
              <button
                onClick={() => setShowVisualization(false)}
                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Function Selector (if multiple functions) */}
            {visualizationData.functions &&
              visualizationData.functions.length > 1 && (
                <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 border-b border-gray-300 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Function:
                    </span>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowFunctionSelector(!showFunctionSelector)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        {currentFunction?.name || "Select function"}
                        {showFunctionSelector ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {showFunctionSelector && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                          {visualizationData.functions.map((func, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedFunctionIndex(index);
                                setShowFunctionSelector(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                selectedFunctionIndex === index
                                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {func.name} (ID: {func.ast_node_id})
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Currently viewing:{" "}
                    <span className="font-semibold">
                      {currentFunction?.name}
                    </span>
                    {visualizationData.functions.length > 1 && (
                      <span className="ml-2">
                        ({selectedFunctionIndex + 1} of{" "}
                        {visualizationData.functions.length})
                      </span>
                    )}
                  </div>
                </div>
              )}

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("ast")}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  activeTab === "ast"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                }`}
              >
                AST
              </button>
              <button
                onClick={() => setActiveTab("cfg")}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  activeTab === "cfg"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                }`}
              >
                CFG
              </button>
              <button
                onClick={() => setActiveTab("dfg")}
                className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                  activeTab === "dfg"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                }`}
              >
                DFG
              </button>
            </div>

            {/* Graph Display */}
            <div className="p-6 bg-white dark:bg-gray-900">
              {activeTab === "ast" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Abstract Syntax Tree
                      </h4>
                      {currentFunction && (
                        <span className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                          Function: {currentFunction.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Total Nodes: {visualizationData.ast.node_count}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Zoom: Scroll • Pan: Drag background • Node colors:
                      Function (blue), If (green), Assignment (orange)
                    </p>
                  </div>
                  <svg
                    ref={astSvgRef}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    style={{ height: "600px" }}
                  />
                </div>
              )}

              {activeTab === "cfg" && currentFunction && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Control Flow Graph
                      </h4>
                      <span className="text-sm text-green-600 dark:text-green-300 font-medium">
                        Function: {currentFunction.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Nodes:
                        </span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                          {currentFunction.cfg.nodes.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Edges:
                        </span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                          {currentFunction.cfg.edges.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Entry ID:
                        </span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                          {currentFunction.cfg.entry_id}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Zoom: Scroll • Pan: Drag background • Drag nodes to
                      reposition • Green: Entry, Red: Exit, Blue: Blocks
                    </p>
                  </div>
                  <svg
                    ref={cfgSvgRef}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    style={{ height: "400px" }}
                  />
                </div>
              )}

              {activeTab === "dfg" && currentFunction && (
                <div className="space-y-4">
                  {currentFunction.dfg.nodes.length === 0 ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                          Data Flow Graph
                        </h4>
                        <span className="text-sm text-yellow-600 dark:text-yellow-300 font-medium">
                          Function: {currentFunction.name}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        No data flow information available for this function.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Data Flow Graph
                          </h4>
                          <span className="text-sm text-purple-600 dark:text-purple-300 font-medium">
                            Function: {currentFunction.name}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Nodes:
                            </span>
                            <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                              {currentFunction.dfg.nodes.length}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Variables:
                            </span>
                            <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                              {
                                Object.keys(currentFunction.dfg.definitions)
                                  .length
                              }
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Data Flows:
                            </span>
                            <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                              {currentFunction.dfg.edges.length}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          Zoom: Scroll • Pan: Drag background • Drag nodes to
                          reposition • Green: Definitions, Orange: Uses
                        </p>
                      </div>
                      <svg
                        ref={dfgSvgRef}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        style={{ height: "400px" }}
                      />
                    </>
                  )}
                </div>
              )}

              {/* Error Message */}
              {visualizationData.error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-red-600 dark:text-red-300 font-medium">
                    Error:
                  </p>
                  <p className="text-red-500 dark:text-red-400 text-sm">
                    {visualizationData.error}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
