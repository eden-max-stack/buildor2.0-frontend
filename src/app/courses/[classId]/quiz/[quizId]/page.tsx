"use client";

import { useState, useEffect, useRef, use, type RefObject } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  ClipboardList,
  BarChart3,
  Play,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import * as d3 from "d3";

const API_BASE = "http://localhost:8000";

// ============================================
// TYPES & INTERFACES (Keep your existing ones here)
// ============================================
interface McqOption {
  option_id: string;
  option_text: string;
}
interface QuizTestCase {
  tc_id: string;
  input: Record<string, any>;
  expected_output: any;
  is_sample: boolean;
}
interface QuizQuestion {
  question_id: string;
  points: number;
  title: string | null;
  description: string | null;
  type: string | null;
  difficulty: string | null;
  tags: string[];
  mcq_options: McqOption[];
  test_cases?: QuizTestCase[];
  constraints?: string[];
}
interface QuizData {
  quiz_id: string;
  title: string;
  questions: QuizQuestion[];
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
// UTILITY FUNCTIONS (Keep your existing ones here)
// ============================================
function getDifficultyColor(difficulty: string | null) {
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
}

function getStatusColor(status: string) {
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
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function QuizTakePage({
  params,
}: {
  params: Promise<{ courseId: string; quizId: string }>;
}) {
  // 1. Unwrap params correctly for Next.js 15
  const unwrappedParams = use(params);
  const classId = unwrappedParams?.courseId || unwrappedParams?.classId;
  const quizId = unwrappedParams?.quizId;

  const supabase = createClient();
  const router = useRouter();

  // --- Quiz-level state ---
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  // ... (Keep ALL your other state variables exactly as they were) ...
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({});
  const [dsaResults, setDsaResults] = useState<
    Record<string, SubmissionResult>
  >({});
  const [hintData, setHintData] = useState<Record<string, HintData>>({});
  const [vizData, setVizData] = useState<Record<string, GraphData>>({});
  const [showViz, setShowViz] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<
    Record<string, "ast" | "cfg" | "dfg">
  >({});
  const [selFuncIdx, setSelFuncIdx] = useState<Record<string, number>>({});
  const [showFuncSelector, setShowFuncSelector] = useState<
    Record<string, boolean>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);

  const astSvgRef = useRef<SVGSVGElement | null>(null);
  const cfgSvgRef = useRef<SVGSVGElement | null>(null);
  const dfgSvgRef = useRef<SVGSVGElement | null>(null);

  // ============================================
  // FETCH QUIZ
  // ============================================

  useEffect(() => {
    // 2. FAIL-FAST LOGIC: If params are missing, kill the loading state immediately
    if (classId && quizId) {
      fetchQuiz();
    } else {
      console.error(
        "Missing URL Parameters! Are you sure your folders are named [courseId] and [quizId]?",
        unwrappedParams,
      );
      setLoading(false); // Force the page to show the "Quiz not found" error instead of spinning forever
    }
  }, [classId, quizId]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id ?? null);
    };
    loadCurrentUser();
  }, [supabase]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(
        `${API_BASE}/api/classes/${classId}/quiz/${quizId}/take`,
        { headers },
      );
      if (!res.ok) throw new Error("Failed to fetch quiz");
      const data = await res.json();
      setQuiz(data);

      const initCode: Record<string, string> = {};
      const initTabs: Record<string, "ast" | "cfg" | "dfg"> = {};
      const initFuncIdx: Record<string, number> = {};
      data.questions.forEach((q: QuizQuestion) => {
        initTabs[q.question_id] = "cfg";
        initFuncIdx[q.question_id] = 0;
        if (q.type !== "MCQ" && q.test_cases && q.test_cases.length > 0) {
          const p = Object.keys(q.test_cases[0].input).join(", ");
          initCode[q.question_id] =
            `def solution(${p}):\n    # Write your solution here\n    pass`;
        }
      });
      setCodeAnswers(initCode);
      setActiveTab(initTabs);
      setSelFuncIdx(initFuncIdx);
    } catch (err) {
      console.error("Error fetching quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // MCQ HANDLER
  // ============================================

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (quizResult) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // ============================================
  // DSA HANDLERS (mirrored from sandbox page)
  // ============================================

  const handleSubmitCode = async (questionId: string) => {
    const code = codeAnswers[questionId];
    if (!code) return;
    if (!currentUserId) {
      alert("You must be signed in to submit code.");
      return;
    }
    setIsSubmitting(true);
    setDsaResults((prev) => {
      const n = { ...prev };
      delete n[questionId];
      return n;
    });
    try {
      const response = await fetch(`${API_BASE}/submissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: questionId,
          user_id: currentUserId,
          code,
          language: "python",
        }),
      });
      if (!response.ok)
        throw new Error(`Submission failed: ${response.status}`);
      const result: SubmissionResult = await response.json();
      setDsaResults((prev) => ({ ...prev, [questionId]: result }));
      setAnswers((prev) => ({
        ...prev,
        [questionId]: result.id || "submitted",
      }));
    } catch (error) {
      console.error("Error submitting code:", error);
      alert("Failed to submit code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetHint = async (questionId: string) => {
    const code = codeAnswers[questionId] || "";
    if (!currentUserId) {
      alert("You must be signed in to get hints.");
      return;
    }
    setIsLoadingHint(true);
    try {
      const response = await fetch(`${API_BASE}/analysis/hint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: questionId,
          user_id: currentUserId,
          user_code: code,
          skill_level: "medium",
        }),
      });
      if (!response.ok)
        throw new Error(`Hint request failed: ${response.status}`);
      const hint: HintData = await response.json();
      setHintData((prev) => ({ ...prev, [questionId]: hint }));
    } catch (error) {
      console.error("Error getting hint:", error);
      alert("Failed to get hint. Please try again.");
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleVisualize = async (questionId: string) => {
    const code = codeAnswers[questionId] || "";
    setIsVisualizing(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/graph/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: code }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setVizData((prev) => ({ ...prev, [questionId]: data }));
      setShowViz((prev) => ({ ...prev, [questionId]: true }));
      setSelFuncIdx((prev) => ({ ...prev, [questionId]: 0 }));
    } catch (error) {
      console.error("Error generating visualization:", error);
      alert("Failed to generate visualization. Please check your code syntax.");
    } finally {
      setIsVisualizing(false);
    }
  };

  // ============================================
  // QUIZ SUBMIT
  // ============================================

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.access_token)
        headers["Authorization"] = `Bearer ${session.access_token}`;
      const res = await fetch(
        `${API_BASE}/api/classes/${classId}/quiz/${quizId}/submit`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ answers }),
        },
      );
      if (!res.ok) throw new Error("Failed to submit quiz");
      const data = await res.json();
      setQuizResult(data);
    } catch (err) {
      console.error("Error submitting quiz:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // D3 VISUALIZATION RENDERERS (copied from sandbox)
  // ============================================

  const renderAST = (astData: any, svgRef: RefObject<SVGSVGElement | null>) => {
    if (!svgRef.current || !astData) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const width = svgRef.current.clientWidth || 800;
    const height = 600;
    svg.attr("width", width).attr("height", height);
    const g = svg.append("g");
    const treeLayout = d3
      .tree<any>()
      .size([width - 100, height - 100])
      .separation((a, b) => (a.parent === b.parent ? 3 : 4));
    const root = d3.hierarchy(astData.root, (d: any) => d.children);
    const treeData = treeLayout(root);
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom as any);
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
    const bounds = (g.node() as SVGGElement | null)?.getBBox();
    if (bounds && bounds.width > 0 && bounds.height > 0) {
      const scale = Math.min(0.9, width / bounds.width, height / bounds.height);
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform as any,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(scale)
            .translate(
              -(bounds.x + bounds.width / 2),
              -(bounds.y + bounds.height / 2),
            ),
        );
    } else {
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
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom as any);
    const link = g
      .selectAll(".link")
      .data(cfgData.edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");
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
    simulation.on("tick", () => {
      (link as any)
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
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom as any);
    const link = g.selectAll(".link").data(dfgData.edges).enter().append("g");
    link
      .append("line")
      .attr("stroke", "#a855f7")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead-dfg)");
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

  // Re-render D3 when tab/function/question changes
  useEffect(() => {
    if (!quiz) return;
    const qid = quiz.questions[currentIndex]?.question_id;
    if (!qid) return;
    const vizd = vizData[qid];
    const visible = showViz[qid];
    if (!vizd || !visible) return;
    const tab = activeTab[qid] || "cfg";
    const funcIdx = selFuncIdx[qid] || 0;
    const currentFunc = vizd.functions?.[funcIdx];
    if (tab === "ast" && vizd.ast) renderAST(vizd.ast, astSvgRef);
    else if (tab === "cfg" && currentFunc?.cfg)
      renderCFG(currentFunc.cfg, cfgSvgRef);
    else if (tab === "dfg" && currentFunc?.dfg)
      renderDFG(currentFunc.dfg, dfgSvgRef);
  }, [currentIndex, vizData, showViz, activeTab, selFuncIdx, quiz]);

  // ============================================
  // LOADING / EMPTY STATES
  // ============================================

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Quiz not found or has no questions.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ============================================
  // DERIVED VALUES
  // ============================================

  const totalQuestions = quiz.questions.length;
  const currentQ = quiz.questions[currentIndex];
  const qid = currentQ.question_id;
  const answeredCount = Object.keys(answers).length;
  const selectedOptionId = answers[qid] || null;
  const questionResult = quizResult?.results?.find(
    (r: any) => r.question_id === qid,
  );
  const currentVizData = vizData[qid];
  const currentShowViz = showViz[qid] || false;
  const currentTab = activeTab[qid] || "cfg";
  const currentSelFuncIdx = selFuncIdx[qid] || 0;
  const currentShowFuncSelector = showFuncSelector[qid] || false;
  const currentFunc = currentVizData?.functions?.[currentSelFuncIdx];
  const currentDsaResult = dsaResults[qid];
  const currentHint = hintData[qid];

  // ============================================
  // RENDER
  // ============================================

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Back Link */}
        <Link
          href={`/courses/${classId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Class
        </Link>

        {/* ── QUIZ NAVIGATION HEADER ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {quiz.title}
              </h1>
            </div>
            {quizResult && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-300">
                  {quizResult.score}/{quizResult.max_score} (
                  {quizResult.percentage}%)
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs font-mono text-gray-500 whitespace-nowrap">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>

          {/* Question dots */}
          <div className="flex flex-wrap gap-2 mt-4">
            {quiz.questions.map((q, idx) => {
              const isAnswered = !!answers[q.question_id];
              const isCurrent = idx === currentIndex;
              const qr = quizResult?.results?.find(
                (r: any) => r.question_id === q.question_id,
              );
              let dotColor = "bg-gray-200 dark:bg-gray-700 text-gray-500";
              if (quizResult && qr) {
                dotColor = qr.is_correct
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white";
              } else if (isCurrent) {
                dotColor = "bg-blue-600 text-white";
              } else if (isAnswered) {
                dotColor =
                  "bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
              }
              return (
                <button
                  key={q.question_id}
                  onClick={() => setCurrentIndex(idx)}
                  title={q.title || `Question ${idx + 1}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${dotColor} ${isCurrent ? "ring-2 ring-blue-400 scale-110" : ""}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MCQ QUESTION ── */}
        {currentQ.type === "MCQ" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  MCQ
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(currentQ.difficulty)}`}
                >
                  {currentQ.difficulty || "N/A"}
                </span>
                <span className="text-xs text-gray-500">
                  {currentQ.points} pts
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentQ.title || "Untitled Question"}
              </h2>
            </div>

            {currentQ.description && (
              <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                {currentQ.description}
              </p>
            )}

            <div className="space-y-3">
              {currentQ.mcq_options.map((option, idx) => {
                const isSelected = selectedOptionId === option.option_id;
                const letter = String.fromCharCode(65 + idx);
                let optionStyles =
                  "border-gray-200 dark:border-gray-600 hover:border-blue-400/60 hover:bg-blue-50/50 dark:hover:bg-blue-900/10";
                if (quizResult && questionResult) {
                  if (questionResult.is_correct && isSelected)
                    optionStyles =
                      "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600";
                  else if (!questionResult.is_correct && isSelected)
                    optionStyles =
                      "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-600";
                  else
                    optionStyles =
                      "border-gray-200 dark:border-gray-600 opacity-50";
                } else if (isSelected) {
                  optionStyles =
                    "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-300 dark:ring-blue-700";
                }
                return (
                  <button
                    key={option.option_id}
                    onClick={() => handleSelectOption(qid, option.option_id)}
                    disabled={!!quizResult}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${optionStyles} ${quizResult ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        quizResult && questionResult?.is_correct && isSelected
                          ? "bg-emerald-500 text-white"
                          : quizResult &&
                              !questionResult?.is_correct &&
                              isSelected
                            ? "bg-red-500 text-white"
                            : isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {quizResult &&
                      questionResult?.is_correct &&
                      isSelected ? (
                        <Check className="w-4 h-4" />
                      ) : quizResult &&
                        !questionResult?.is_correct &&
                        isSelected ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        letter
                      )}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 pt-1">
                      {option.option_text}
                    </span>
                  </button>
                );
              })}
            </div>

            {quizResult && questionResult && (
              <div
                className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
                  questionResult.is_correct
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                }`}
              >
                {questionResult.is_correct ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0" />
                )}
                <span className="font-bold text-sm">
                  {questionResult.is_correct
                    ? `Correct! +${questionResult.points_earned} pts`
                    : `Incorrect. 0/${questionResult.points_possible} pts`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── DSA QUESTION (full sandbox layout) ── */}
        {currentQ.type !== "MCQ" && (
          <div className="space-y-8">
            {/* Security notice banner */}
            <div className="bg-brand-amber/10 border border-brand-amber/30 rounded-xl p-5 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-brand-amber shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-brand-dark dark:text-amber-200 text-base">
                  Sandbox Execution Disabled
                </h3>
                <p className="text-sm text-gray-700 dark:text-amber-100/70 mt-1.5 leading-relaxed">
                  This interactive code execution feature has not been fully
                  activated yet. We are currently incorporating critical
                  security patches into the backend isolated environment before
                  it can be safely deployed for live code execution. The
                  interface below is a visual preview.
                </p>
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-brand-dark dark:text-white mb-2">
                  {currentQ.title}
                </h2>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(currentQ.difficulty)}`}
                  >
                    {currentQ.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentQ.points} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
                {currentQ.tags && currentQ.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-brand-dark dark:text-gray-200 mb-2">
                      Tags:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentQ.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {currentQ.description && (
                  <div>
                    <h3 className="font-semibold text-brand-dark dark:text-gray-200 mb-2">
                      Description:
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                      {currentQ.description}
                    </p>
                  </div>
                )}
                {currentQ.constraints && currentQ.constraints.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-brand-dark dark:text-gray-200 mb-2">
                      Constraints:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {currentQ.constraints.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {currentQ.test_cases &&
                  currentQ.test_cases.filter((tc) => tc.is_sample).length >
                    0 && (
                    <div>
                      <h3 className="font-semibold text-brand-dark dark:text-gray-200 mb-2">
                        Examples:
                      </h3>
                      <div className="space-y-3">
                        {currentQ.test_cases
                          .filter((tc) => tc.is_sample)
                          .map((tc) => (
                            <div
                              key={tc.tc_id}
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
              </div>

              {/* Right Panel - Editor and Output */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                    <span className="text-sm text-gray-200 font-bold">
                      Code Editor
                    </span>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSubmitCode(qid)}
                        disabled={isSubmitting}
                        className={`flex items-center gap-1 px-3 py-1 text-sm rounded font-semibold transition-all ${isSubmitting ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                      >
                        <Play className="w-3 h-3" />
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                      <button
                        onClick={() => handleVisualize(qid)}
                        disabled={isVisualizing}
                        className={`flex items-center gap-1 px-3 py-1 text-sm rounded font-semibold transition-all ${isVisualizing ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                      >
                        <Eye className="w-3 h-3" />
                        {isVisualizing ? "Visualizing..." : "Visualize"}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={codeAnswers[qid] || ""}
                    onChange={(e) =>
                      setCodeAnswers((prev) => ({
                        ...prev,
                        [qid]: e.target.value,
                      }))
                    }
                    className="w-full h-96 bg-gray-900 text-white p-6 font-mono text-sm focus:outline-none resize-none"
                    spellCheck={false}
                    placeholder="Write your solution here..."
                  />
                </div>

                {/* Submission Results */}
                {currentDsaResult && (
                  <div
                    className={`border-2 rounded-lg p-6 ${currentDsaResult.status === "accepted" ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-red-50 dark:bg-red-900/20 border-red-500"}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {currentDsaResult.status === "accepted" ? (
                          <Check className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        <div>
                          <h3 className="font-bold text-lg">
                            <span
                              className={getStatusColor(
                                currentDsaResult.status,
                              )}
                            >
                              {currentDsaResult.status
                                .replace(/_/g, " ")
                                .toUpperCase()}
                            </span>
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentDsaResult.test_cases_passed} /{" "}
                            {currentDsaResult.total_test_cases} test cases
                            passed
                          </p>
                        </div>
                      </div>
                      {currentDsaResult.runtime_ms !== undefined && (
                        <div className="text-right text-sm">
                          <div className="text-gray-700 dark:text-gray-300">
                            Runtime:{" "}
                            <span className="font-semibold">
                              {currentDsaResult.runtime_ms}ms
                            </span>
                          </div>
                          {currentDsaResult.memory_kb !== undefined && (
                            <div className="text-gray-700 dark:text-gray-300">
                              Memory:{" "}
                              <span className="font-semibold">
                                {(currentDsaResult.memory_kb / 1024).toFixed(2)}
                                MB
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {currentDsaResult.error_message && (
                      <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                        <p className="text-sm font-mono text-red-800 dark:text-red-300">
                          {currentDsaResult.error_message}
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {currentDsaResult.test_results
                        .filter((tr) => tr.is_sample)
                        .map((tr, idx) => (
                          <div
                            key={tr.test_case_id}
                            className={`p-3 rounded border ${tr.passed ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700" : "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700"}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm">
                                Test Case {idx + 1}
                              </span>
                              {tr.passed ? (
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
                                  {JSON.stringify(tr.input)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Expected:
                                </span>{" "}
                                <span className="text-gray-900 dark:text-gray-100">
                                  {JSON.stringify(tr.expected_output)}
                                </span>
                              </div>
                              {tr.actual_output !== undefined && (
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Got:
                                  </span>{" "}
                                  <span
                                    className={
                                      tr.passed
                                        ? "text-green-700 dark:text-green-300"
                                        : "text-red-700 dark:text-red-300"
                                    }
                                  >
                                    {JSON.stringify(tr.actual_output)}
                                  </span>
                                </div>
                              )}
                              {tr.error_message && (
                                <div className="text-red-700 dark:text-red-300">
                                  Error: {tr.error_message}
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
                    {currentHint && (
                      <span className="ml-3 text-sm font-normal text-gray-600 dark:text-gray-400">
                        ({currentHint.hints_used} hints used)
                      </span>
                    )}
                  </h3>
                  {currentHint ? (
                    <div className="space-y-3">
                      <div className="flex flex-col md:flex-row md:items-start gap-3">
                        <div className="flex-1 bg-white rounded-lg p-4 border-l-4 border-brand-amber dark:bg-gray-800">
                          <p className="text-gray-700 dark:text-gray-300">
                            {currentHint.hint}
                          </p>
                        </div>
                        {currentHint.analysis && (
                          <div className="md:w-56 bg-white/60 dark:bg-gray-900/40 border border-brand-amber/30 rounded-lg p-3">
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
                                  Bug Type
                                </span>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200">
                                  {currentHint.analysis.bug_type}
                                </span>
                              </div>
                              {currentHint.analysis.bug_line !== undefined &&
                                currentHint.analysis.bug_line !== null && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
                                      Line
                                    </span>
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                                      {currentHint.analysis.bug_line}
                                    </span>
                                  </div>
                                )}
                              {typeof currentHint.analysis.confidence ===
                                "number" && (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
                                    Confidence
                                  </span>
                                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                                    {(
                                      currentHint.analysis.confidence * 100
                                    ).toFixed(1)}
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
                    onClick={() => handleGetHint(qid)}
                    disabled={isLoadingHint}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${isLoadingHint ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60" : "bg-brand-amber text-brand-dark hover:bg-amber-500 active:scale-95"}`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    {isLoadingHint ? "Generating Hint..." : "Get Hint"}
                  </button>
                </div>
              </div>
            </div>

            {/* Visualization Section */}
            {currentShowViz && currentVizData && (
              <div className="mb-12 bg-white dark:bg-gray-800 border-2 border-blue-500/30 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-white" />
                    <h3 className="font-bold text-white text-lg">
                      Code Visualization
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      setShowViz((prev) => ({ ...prev, [qid]: false }))
                    }
                    className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {currentVizData.functions &&
                  currentVizData.functions.length > 1 && (
                    <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 border-b border-gray-300 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Select Function:
                        </span>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowFuncSelector((prev) => ({
                                ...prev,
                                [qid]: !currentShowFuncSelector,
                              }))
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            {currentFunc?.name || "Select function"}
                            {currentShowFuncSelector ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          {currentShowFuncSelector && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                              {currentVizData.functions.map((func, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSelFuncIdx((prev) => ({
                                      ...prev,
                                      [qid]: index,
                                    }));
                                    setShowFuncSelector((prev) => ({
                                      ...prev,
                                      [qid]: false,
                                    }));
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${currentSelFuncIdx === index ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}
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
                          {currentFunc?.name}
                        </span>
                        {currentVizData.functions.length > 1 && (
                          <span className="ml-2">
                            ({currentSelFuncIdx + 1} of{" "}
                            {currentVizData.functions.length})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                  {(["ast", "cfg", "dfg"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() =>
                        setActiveTab((prev) => ({ ...prev, [qid]: tab }))
                      }
                      className={`px-4 py-2 rounded font-semibold text-sm transition-all ${currentTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"}`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="p-6 bg-white dark:bg-gray-900">
                  {currentTab === "ast" && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Abstract Syntax Tree
                          </h4>
                          {currentFunc && (
                            <span className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                              Function: {currentFunc.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Total Nodes: {currentVizData.ast.node_count}
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
                  {currentTab === "cfg" && currentFunc && (
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Control Flow Graph
                          </h4>
                          <span className="text-sm text-green-600 dark:text-green-300 font-medium">
                            Function: {currentFunc.name}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Nodes:
                            </span>
                            <span className="ml-2 font-semibold">
                              {currentFunc.cfg.nodes.length}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Edges:
                            </span>
                            <span className="ml-2 font-semibold">
                              {currentFunc.cfg.edges.length}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">
                              Entry ID:
                            </span>
                            <span className="ml-2 font-semibold">
                              {currentFunc.cfg.entry_id}
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
                  {currentTab === "dfg" && currentFunc && (
                    <div className="space-y-4">
                      {currentFunc.dfg.nodes.length === 0 ? (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                              Data Flow Graph
                            </h4>
                            <span className="text-sm text-yellow-600 dark:text-yellow-300 font-medium">
                              Function: {currentFunc.name}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            No data flow information available for this
                            function.
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
                                Function: {currentFunc.name}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Nodes:
                                </span>
                                <span className="ml-2 font-semibold">
                                  {currentFunc.dfg.nodes.length}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Variables:
                                </span>
                                <span className="ml-2 font-semibold">
                                  {
                                    Object.keys(currentFunc.dfg.definitions)
                                      .length
                                  }
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Data Flows:
                                </span>
                                <span className="ml-2 font-semibold">
                                  {currentFunc.dfg.edges.length}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                              Zoom: Scroll • Pan: Drag background • Drag nodes
                              to reposition • Green: Definitions, Orange: Uses
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
                  {currentVizData.error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                      <p className="text-red-600 dark:text-red-300 font-medium">
                        Error:
                      </p>
                      <p className="text-red-500 dark:text-red-400 text-sm">
                        {currentVizData.error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── NAVIGATION BAR ── */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-3">
            {!quizResult && (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting || answeredCount === 0}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Submit Quiz ({answeredCount}/{totalQuestions})
              </button>
            )}
            {quizResult && (
              <Link
                href={`/classes/${classId}`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors"
              >
                Back to Class
              </Link>
            )}
          </div>

          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))
            }
            disabled={currentIndex === totalQuestions - 1}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
