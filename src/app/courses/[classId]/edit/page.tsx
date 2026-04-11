"use client";

import React, { useState, useEffect, use } from "react";
import Layout from "@/components/Layout";
import {
  GripVertical,
  Plus,
  Edit2,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  Clock,
  Save,
  X,
  CheckSquare,
  ChevronDown,
  Loader2,
  Check,
  Settings,
  Code,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ActiveTab = "CURRICULUM" | "QUIZZES" | "SETTINGS";

export default function ClassEditor({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const unwrappedParams = use(params);
  const classId = unwrappedParams.classId;
  const [activeTab, setActiveTab] = useState<ActiveTab>("CURRICULUM");
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // --- SETTINGS STATE ---
  const [settingsForm, setSettingsForm] = useState({
    title: "",
    description: "",
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // --- MODAL STATE FOR MATERIAL EDITING ---
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);

  // --- STATE FOR INLINE PHASE EDITING ---
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [editPhaseTitle, setEditPhaseTitle] = useState("");
  const [isSavingPhase, setIsSavingPhase] = useState(false);

  // --- STATE FOR ADDING MATERIAL ---
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [addMaterialPhaseId, setAddMaterialPhaseId] = useState<string | null>(
    null,
  );
  const [addForm, setAddForm] = useState({
    type: "VIDEO",
    title: "",
    content_url: "",
  });
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);

  // --- STATE FOR EDITING QUESTIONS ---
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [questionForm, setQuestionForm] = useState<any>({}); // Completely empty by default
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);

  // --- STATE FOR QUIZZES ---
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizDueDate, setNewQuizDueDate] = useState("");
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);

  const [isQuizEditorOpen, setIsQuizEditorOpen] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  // ==========================================
  // 1. FETCH REAL CLASS DATA
  // ==========================================
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) throw new Error("Not authenticated");

        const response = await fetch(
          `http://localhost:8000/api/classes/${classId}/editor`,
          { headers: { Authorization: `Bearer ${session.access_token}` } },
        );

        if (!response.ok) throw new Error("Failed to load class editor data");
        const data = await response.json();

        if (data.class_phases) {
          data.class_phases = data.class_phases.map((p: any) => ({
            ...p,
            isExpanded: true,
          }));
        } else {
          data.class_phases = [];
        }
        if (!data.quizzes) data.quizzes = [];

        setClassData(data);
        setSettingsForm({
          title: data.title,
          description: data.description || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load class data.");
      } finally {
        setLoading(false);
      }
    };

    if (classId) fetchClassDetails();
  }, [classId, supabase]);

  // ==========================================
  // MATERIAL HANDLERS (EDIT & ADD)
  // ==========================================
  const openEditModal = (material: any) => {
    setEditingItem(material);
    setEditTitle(material.title);
    setEditUrl(material.content_url || "");
  };

  const handleSaveMaterial = async () => {
    if (!editingItem) return;
    setIsSavingMaterial(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `http://localhost:8000/api/classes/materials/${editingItem.material_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ title: editTitle, content_url: editUrl }),
        },
      );

      if (!response.ok) throw new Error("Failed to update material");

      setClassData((prev: any) => {
        const updatedPhases = prev.class_phases.map((phase: any) => ({
          ...phase,
          materials: phase.materials.map((mat: any) =>
            mat.material_id === editingItem.material_id
              ? { ...mat, title: editTitle, content_url: editUrl }
              : mat,
          ),
        }));
        return { ...prev, class_phases: updatedPhases };
      });
      setEditingItem(null);
    } catch (err) {
      alert("Failed to save material.");
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const openAddMaterialModal = (phaseId: string) => {
    setAddMaterialPhaseId(phaseId);
    setAddForm({ type: "VIDEO", title: "", content_url: "" });
    setIsAddMaterialOpen(true);
  };

  const handleAddMaterial = async () => {
    if (!addMaterialPhaseId || !addForm.title) return;
    setIsAddingMaterial(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `http://localhost:8000/api/classes/phases/${addMaterialPhaseId}/materials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            ...addForm,
            order_index:
              classData.class_phases.find(
                (p: any) => p.phase_id === addMaterialPhaseId,
              )?.materials.length + 1,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to add material");
      const newMaterial = await response.json();

      setClassData((prev: any) => ({
        ...prev,
        class_phases: prev.class_phases.map((phase: any) =>
          phase.phase_id === addMaterialPhaseId
            ? {
                ...phase,
                materials: [
                  ...phase.materials,
                  newMaterial.data || newMaterial,
                ],
              }
            : phase,
        ),
      }));
      setIsAddMaterialOpen(false);
    } catch (err) {
      alert("Failed to add material.");
    } finally {
      setIsAddingMaterial(false);
    }
  };

  // ==========================================
  // QUESTION HANDLERS
  // ==========================================
  const openQuestionEditModal = (
    questionData: any,
    isQuizContext = false,
    contextId = "",
  ) => {
    const qData = Array.isArray(questionData) ? questionData[0] : questionData;

    // Handle nested question data (from quiz context with qq.questions structure)
    const actualQData = qData.questions || qData;

    setEditingQuestion({ ...qData, isQuizContext, contextId, isNew: false });

    // Transform API data to match form structure
    const transformedOptions = (actualQData?.mcq_options || []).map(
      (opt: any) => ({
        id: opt.option_id || crypto.randomUUID(),
        text: opt.option_text || opt.text || "",
        isCorrect: opt.is_correct ?? opt.isCorrect ?? false,
      }),
    );

    const transformedTestCases = (actualQData?.test_cases || []).map(
      (tc: any) => ({
        id: tc.tc_id || crypto.randomUUID(),
        input: typeof tc.input === "string" ? tc.input : tc.input?.raw || "",
        expectedOutput:
          typeof tc.expected_output === "string"
            ? tc.expected_output
            : tc.expected_output?.raw || "",
        isSample: tc.is_sample ?? tc.isSample ?? false,
      }),
    );

    // Explicitly mapping data and leaving it blank if it doesn't exist yet
    setQuestionForm({
      title: actualQData?.title || "",
      description: actualQData?.description || "",
      difficulty: actualQData?.difficulty || "",
      type: actualQData?.type || "DSA",
      optimal_solution: actualQData?.optimal_solution || "",
      constraints: actualQData?.constraints || "",
      testCases: transformedTestCases,
      options: transformedOptions,
      points:
        qData?.points !== undefined && qData?.points !== null
          ? String(qData.points)
          : "",
    });
  };

  // FORM FIRST APPROACH: Open blank modal for a new Quiz Question
  const handleAddQuestionToQuiz = (type: "MCQ" | "DSA") => {
    if (!editingQuizId) return;

    setEditingQuestion({
      isNew: true,
      isQuizContext: true,
      contextId: editingQuizId,
    });
    setQuestionForm({
      title: "",
      description: "",
      difficulty: "",
      type: type,
      optimal_solution: "",
      constraints: "",
      testCases: [],
      options: [],
      points: "", // Blank points
    });
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion) return;
    setIsSavingQuestion(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Build payload with only relevant fields for the question type
      let payload: any = {
        title: questionForm.title,
        description: questionForm.description,
        type: questionForm.type,
        difficulty: questionForm.difficulty || "Medium", // Default to Medium if empty
        points:
          questionForm.points !== "" ? parseInt(questionForm.points) : null,
      };

      // Add MCQ-specific fields
      if (questionForm.type === "MCQ") {
        payload.options = questionForm.options || [];
      }

      // Add DSA-specific fields
      if (questionForm.type === "DSA") {
        payload.optimal_solution = questionForm.optimal_solution || "";
        payload.constraints = questionForm.constraints || "";
        payload.testCases = questionForm.testCases || [];
      }

      if (editingQuestion.isNew) {
        // --- POST: CREATE NEW QUIZ QUESTION ---
        const response = await fetch(
          `http://localhost:8000/api/classes/quizzes/${editingQuestion.contextId}/questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) throw new Error("Failed to create question");
        const data = await response.json();

        const newLinkedQuestion = {
          question_id: data.question.question_id,
          points: payload.points,
          questions: data.question,
        };

        setClassData((prev: any) => ({
          ...prev,
          quizzes: prev.quizzes.map((q: any) =>
            q.quiz_id === editingQuestion.contextId
              ? {
                  ...q,
                  quiz_questions: [
                    ...(q.quiz_questions || []),
                    newLinkedQuestion,
                  ],
                }
              : q,
          ),
        }));
      } else {
        // --- PUT: UPDATE EXISTING QUESTION ---
        const response = await fetch(
          `http://localhost:8000/api/classes/questions/${editingQuestion.question_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              ...payload,
              quiz_id: editingQuestion.isQuizContext
                ? editingQuestion.contextId
                : null,
            }),
          },
        );

        if (!response.ok) throw new Error("Failed to update question");

        setClassData((prev: any) => {
          if (editingQuestion.isQuizContext) {
            return {
              ...prev,
              quizzes: prev.quizzes.map((q: any) =>
                q.quiz_id === editingQuestion.contextId
                  ? {
                      ...q,
                      quiz_questions: q.quiz_questions.map((qq: any) =>
                        qq.question_id === editingQuestion.question_id
                          ? {
                              ...qq,
                              points: payload.points,
                              questions: { ...qq.questions, ...questionForm },
                            }
                          : qq,
                      ),
                    }
                  : q,
              ),
            };
          } else {
            return {
              ...prev,
              class_phases: prev.class_phases.map((phase: any) => ({
                ...phase,
                materials: phase.materials.map((mat: any) =>
                  mat.material_id === editingQuestion.contextId
                    ? {
                        ...mat,
                        title: questionForm.title,
                        questions: { ...mat.questions, ...questionForm },
                      }
                    : mat,
                ),
              })),
            };
          }
        });
      }

      setEditingQuestion(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save question.");
    } finally {
      setIsSavingQuestion(false);
    }
  };

  // Dynamic Array Handlers for Questions
  const addTestCase = () =>
    setQuestionForm((prev: any) => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        {
          id: crypto.randomUUID(),
          input: "",
          expectedOutput: "",
          isSample: false,
        },
      ],
    }));
  const updateTestCase = (idx: number, field: string, value: any) => {
    const newTCs = [...questionForm.testCases];
    newTCs[idx][field] = value;
    setQuestionForm({ ...questionForm, testCases: newTCs });
  };
  const removeTestCase = (idx: number) =>
    setQuestionForm((prev: any) => ({
      ...prev,
      testCases: prev.testCases.filter((_: any, i: number) => i !== idx),
    }));

  const addOption = () =>
    setQuestionForm((prev: any) => ({
      ...prev,
      options: [
        ...prev.options,
        { id: crypto.randomUUID(), text: "", isCorrect: false },
      ],
    }));
  const updateOptionText = (idx: number, text: string) => {
    const newOpts = [...questionForm.options];
    newOpts[idx].text = text;
    setQuestionForm({ ...questionForm, options: newOpts });
  };
  const setCorrectOption = (idx: number) => {
    const newOpts = questionForm.options.map((o: any, i: number) => ({
      ...o,
      isCorrect: i === idx,
    }));
    setQuestionForm({ ...questionForm, options: newOpts });
  };
  const removeOption = (idx: number) =>
    setQuestionForm((prev: any) => ({
      ...prev,
      options: prev.options.filter((_: any, i: number) => i !== idx),
    }));

  // ==========================================
  // QUIZ CREATION HANDLERS
  // ==========================================
  const handleCreateQuiz = async () => {
    if (!newQuizTitle.trim()) return alert("Quiz title is required");
    setIsCreatingQuiz(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      let formattedDate = null;
      if (newQuizDueDate)
        formattedDate = new Date(newQuizDueDate).toISOString();

      const response = await fetch(
        `http://localhost:8000/api/classes/${classId}/quizzes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            title: newQuizTitle,
            due_date: formattedDate,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to create quiz");
      const data = await response.json();

      setClassData((prev: any) => ({
        ...prev,
        quizzes: [
          ...prev.quizzes,
          {
            quiz_id: data.quiz_id,
            title: newQuizTitle,
            due_date: formattedDate,
            quiz_questions: [],
          },
        ],
      }));
      setNewQuizTitle("");
      setNewQuizDueDate("");
      setIsQuizModalOpen(false);
    } catch (err) {
      alert("Failed to create quiz.");
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  const openQuizEditor = (quizId: string) => {
    setEditingQuizId(quizId);
    setIsQuizEditorOpen(true);
  };

  // ==========================================
  // PHASE & SETTINGS HANDLERS
  // ==========================================
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const response = await fetch(
        `http://localhost:8000/api/classes/${classId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(settingsForm),
        },
      );
      if (!response.ok) throw new Error("Failed to update class settings");
      setClassData((prev: any) => ({
        ...prev,
        title: settingsForm.title,
        description: settingsForm.description,
      }));
      alert("Settings saved successfully.");
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const openPhaseEdit = (phase: any) => {
    setEditingPhaseId(phase.phase_id);
    setEditPhaseTitle(phase.title);
  };

  const handleSavePhase = async () => {
    if (!editingPhaseId) return;
    setIsSavingPhase(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const response = await fetch(
        `http://localhost:8000/api/classes/phases/${editingPhaseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ title: editPhaseTitle }),
        },
      );
      if (!response.ok) throw new Error("Failed to update phase");
      setClassData((prev: any) => {
        const updatedPhases = prev.class_phases.map((phase: any) =>
          phase.phase_id === editingPhaseId
            ? { ...phase, title: editPhaseTitle }
            : phase,
        );
        return { ...prev, class_phases: updatedPhases };
      });
      setEditingPhaseId(null);
    } catch (err) {
      alert("Failed to update phase.");
    } finally {
      setIsSavingPhase(false);
    }
  };

  const handlePhaseKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSavePhase();
    else if (e.key === "Escape") setEditingPhaseId(null);
  };

  const getIconForType = (type: string) => {
    if (type === "VIDEO") return <Video className="w-4 h-4 text-blue-500" />;
    if (type === "ARTICLE")
      return <FileText className="w-4 h-4 text-green-500" />;
    return <HelpCircle className="w-4 h-4 text-orange-500" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading || !classData)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">
                Editing Class
              </p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {classData.title}
              </h1>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 mt-4 flex gap-6">
            <button
              onClick={() => setActiveTab("CURRICULUM")}
              className={`pb-3 text-sm font-medium border-b-2 ${activeTab === "CURRICULUM" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
            >
              Curriculum (Phases)
            </button>
            <button
              onClick={() => setActiveTab("QUIZZES")}
              className={`pb-3 text-sm font-medium border-b-2 ${activeTab === "QUIZZES" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
            >
              Quizzes & Assessments
            </button>
            <button
              onClick={() => setActiveTab("SETTINGS")}
              className={`pb-3 text-sm font-medium border-b-2 ${activeTab === "SETTINGS" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
            >
              Class Settings
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* --- CURRICULUM TAB --- */}
          {activeTab === "CURRICULUM" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Course Phases
                </h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Phase
                </button>
              </div>

              {classData.class_phases?.map((phase: any, pIdx: number) => (
                <div
                  key={phase.phase_id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 flex items-center justify-between group border-b border-gray-200 dark:border-gray-800 h-14">
                    <div className="flex items-center gap-3 flex-1 mr-4">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-grab opacity-50 group-hover:opacity-100 shrink-0" />
                      {editingPhaseId === phase.phase_id ? (
                        <div className="flex-1 flex items-center max-w-md">
                          <input
                            type="text"
                            autoFocus
                            value={editPhaseTitle}
                            onChange={(e) => setEditPhaseTitle(e.target.value)}
                            onKeyDown={handlePhaseKeyDown}
                            className="flex-1 px-2 py-1 text-sm font-bold bg-white dark:bg-gray-950 border border-blue-500 rounded outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>
                      ) : (
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                          Phase {pIdx + 1}: {phase.title}
                        </h3>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {editingPhaseId === phase.phase_id ? (
                        <button
                          onClick={handleSavePhase}
                          className="p-1.5 text-green-600 bg-green-100 hover:bg-green-200 rounded transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => openPhaseEdit(phase)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    {phase.materials?.map((mat: any) => (
                      <div
                        key={mat.material_id}
                        className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-blue-300 transition-colors group bg-white dark:bg-gray-950"
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                          {getIconForType(mat.type)}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {mat.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              mat.type === "QUESTION"
                                ? openQuestionEditModal(
                                    mat.questions,
                                    false,
                                    mat.material_id,
                                  )
                                : openEditModal(mat)
                            }
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => openAddMaterialModal(phase.phase_id)}
                      className="w-full mt-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-all flex justify-center items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Material to Phase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- QUIZZES TAB --- */}
          {activeTab === "QUIZZES" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Standalone Quizzes
                  </h2>
                  <p className="text-sm text-gray-500">
                    Standalone assessments you construct from scratch.
                  </p>
                </div>
                <button
                  onClick={() => setIsQuizModalOpen(true)}
                  className="text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Create New Quiz
                </button>
              </div>

              {classData.quizzes?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-300 dark:border-gray-800">
                  <CheckSquare className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <h3 className="text-gray-500 font-medium">
                    No quizzes created yet
                  </h3>
                </div>
              ) : (
                <div className="grid gap-6">
                  {classData.quizzes?.map((quiz: any) => (
                    <div
                      key={quiz.quiz_id}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm"
                    >
                      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                            <CheckSquare className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              {quiz.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Due: {formatDate(quiz.due_date)} •{" "}
                              {quiz.quiz_questions?.length || 0} Questions
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingQuizId(quiz.quiz_id);
                              handleAddQuestionToQuiz("MCQ");
                            }}
                            className="text-xs px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            + Add MCQ
                          </button>
                          <button
                            onClick={() => {
                              setEditingQuizId(quiz.quiz_id);
                              handleAddQuestionToQuiz("DSA");
                            }}
                            className="text-xs px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            + Add DSA
                          </button>
                        </div>
                      </div>

                      <div className="p-2 bg-gray-50 dark:bg-gray-950">
                        {quiz.quiz_questions?.length === 0 && (
                          <div className="text-center py-4 text-xs text-gray-500 italic">
                            No questions added.
                          </div>
                        )}
                        {quiz.quiz_questions?.map((qq: any, idx: number) => {
                          const qData = Array.isArray(qq.questions)
                            ? qq.questions[0]
                            : qq.questions;
                          return (
                            <div
                              key={qData?.question_id || idx}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg m-2"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-400 w-5">
                                  {idx + 1}.
                                </span>
                                {qData?.type === "DSA" ? (
                                  <Code className="w-4 h-4 text-purple-500" />
                                ) : (
                                  <HelpCircle className="w-4 h-4 text-green-500" />
                                )}
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {qData?.title || "Untitled Question"}
                                </p>
                                <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {qq.points || 0} pts
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  openQuestionEditModal(qq, true, quiz.quiz_id)
                                }
                                className="text-xs font-medium text-blue-600 hover:text-blue-800"
                              >
                                Edit Question
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- SETTINGS TAB --- */}
          {activeTab === "SETTINGS" && (
            <div className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-gray-500" /> General Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Class Title
                  </label>
                  <input
                    type="text"
                    value={settingsForm.title}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.description}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {isSavingSettings ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}{" "}
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* =========================================
            ADD MATERIAL MODAL 
            ========================================= */}
        {isAddMaterialOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-500" /> Add Material
                </h3>
                <button
                  onClick={() => setIsAddMaterialOpen(false)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={addForm.type}
                    onChange={(e) =>
                      setAddForm({ ...addForm, type: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="VIDEO">Video</option>
                    <option value="ARTICLE">Article</option>
                    <option value="QUESTION">Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={addForm.title}
                    onChange={(e) =>
                      setAddForm({ ...addForm, title: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {addForm.type !== "QUESTION" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content URL
                    </label>
                    <input
                      type="url"
                      value={addForm.content_url}
                      onChange={(e) =>
                        setAddForm({ ...addForm, content_url: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/30">
                <button
                  onClick={() => setIsAddMaterialOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMaterial}
                  disabled={isAddingMaterial || !addForm.title}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg"
                >
                  {isAddingMaterial ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}{" "}
                  Add to Phase
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            EDIT MATERIAL MODAL
            ========================================= */}
        {editingItem && editingItem.type !== "QUESTION" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between">
                <h3 className="font-bold flex gap-2">
                  <Edit2 className="w-4 h-4 text-blue-500" /> Edit Material
                </h3>
                <button onClick={() => setEditingItem(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border p-2 rounded dark:bg-gray-950 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full border p-2 rounded dark:bg-gray-950 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-gray rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMaterial}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            CREATE QUIZ MODAL
            ========================================= */}
        {isQuizModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-500" /> Create New
                  Quiz
                </h3>
                <button
                  onClick={() => setIsQuizModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quiz Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midterm Assessment"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newQuizDueDate}
                    onChange={(e) => setNewQuizDueDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/30">
                <button
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateQuiz}
                  disabled={isCreatingQuiz || !newQuizTitle.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-sm transition-colors"
                >
                  {isCreatingQuiz ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}{" "}
                  Create Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            EDIT QUESTION MODAL (Works for Phases AND Quizzes)
            ========================================= */}
        {editingQuestion && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 shrink-0">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {questionForm.type === "DSA" ? (
                    <Code className="w-4 h-4 text-purple-500" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-green-500" />
                  )}{" "}
                  Edit Question
                </h3>
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Question Title
                    </label>
                    <input
                      type="text"
                      value={questionForm.title}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Points Input (Only visible if Editing a Quiz Question) */}
                  {editingQuestion.isQuizContext && (
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-blue-600">
                        Points
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={questionForm.points}
                        onChange={(e) =>
                          setQuestionForm({
                            ...questionForm,
                            points: e.target.value,
                          })
                        }
                        className="w-full rounded-md border border-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={questionForm.difficulty}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          difficulty: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (Markdown)
                  </label>
                  <textarea
                    rows={3}
                    value={questionForm.description}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                {/* --- MCQ DYNAMIC ARRAYS --- */}
                {questionForm.type === "MCQ" && (
                  <div className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-4 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                        MCQ Options
                      </label>
                      <button
                        onClick={addOption}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Option
                      </button>
                    </div>
                    <div className="space-y-2">
                      {questionForm.options?.map((opt: any, idx: number) => (
                        <div
                          key={idx}
                          className={`flex gap-2 items-center p-2 rounded border transition-colors ${opt.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30"}`}
                        >
                          <input
                            type="radio"
                            name="mcq_correct"
                            checked={opt.isCorrect}
                            onChange={() => setCorrectOption(idx)}
                            className="text-green-600 w-4 h-4 focus:ring-green-500 cursor-pointer"
                            title="Mark as correct answer"
                          />
                          <input
                            type="text"
                            placeholder="Option text"
                            value={opt.text}
                            onChange={(e) =>
                              updateOptionText(idx, e.target.value)
                            }
                            className="flex-1 text-sm py-1.5 px-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-950 focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => removeOption(idx)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {questionForm.options?.length === 0 && (
                        <p className="text-xs text-gray-400 italic">
                          No options added yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* --- DSA DYNAMIC ARRAYS --- */}
                {questionForm.type === "DSA" && (
                  <div className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-4 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Constraints
                        </label>
                        <textarea
                          rows={2}
                          value={questionForm.constraints}
                          onChange={(e) =>
                            setQuestionForm({
                              ...questionForm,
                              constraints: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Optimal Solution (Hidden)
                        </label>
                        <textarea
                          rows={2}
                          value={questionForm.optimal_solution}
                          onChange={(e) =>
                            setQuestionForm({
                              ...questionForm,
                              optimal_solution: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm font-mono text-gray-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                          Test Cases
                        </label>
                        <button
                          onClick={addTestCase}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Test Case
                        </button>
                      </div>
                      <div className="space-y-2">
                        {questionForm.testCases?.map((tc: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex gap-2 items-center bg-gray-50 dark:bg-gray-800/30 p-2 rounded border border-gray-200 dark:border-gray-700"
                          >
                            <input
                              type="text"
                              placeholder="Input JSON (e.g. [1,2,3])"
                              value={tc.input}
                              onChange={(e) =>
                                updateTestCase(idx, "input", e.target.value)
                              }
                              className="flex-1 text-xs py-1.5 px-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-950 font-mono focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Expected Output JSON"
                              value={tc.expectedOutput}
                              onChange={(e) =>
                                updateTestCase(
                                  idx,
                                  "expectedOutput",
                                  e.target.value,
                                )
                              }
                              className="flex-1 text-xs py-1.5 px-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-950 font-mono focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tc.isSample}
                                onChange={(e) =>
                                  updateTestCase(
                                    idx,
                                    "isSample",
                                    e.target.checked,
                                  )
                                }
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />{" "}
                              Sample
                            </label>
                            <button
                              onClick={() => removeTestCase(idx)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {questionForm.testCases?.length === 0 && (
                          <p className="text-xs text-gray-400 italic">
                            No test cases added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/30 shrink-0">
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuestion}
                  disabled={isSavingQuestion}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {isSavingQuestion ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}{" "}
                  Save Question
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
