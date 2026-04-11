"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import {
  Plus,
  Trash2,
  GripVertical,
  BookOpen,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Code,
  ListTodo,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// --- TYPES MAPPED TO YOUR SCHEMA ---
type MaterialType = "VIDEO" | "ARTICLE";
type QuestionType = "MCQ_QUESTION" | "DSA_QUESTION";
type DifficultyLevel = "Easy" | "Medium" | "Hard";

interface MaterialForm {
  id: string; // Temporary client-side ID
  title: string;
  type: MaterialType;
  content_url: string;
}

interface TestCaseForm {
  id: string;
  input: string; // Stored as JSON string in UI, parsed to JSONB in backend
  expectedOutput: string;
  isSample: boolean;
}

interface McqOptionForm {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuestionForm {
  id: string;
  title: string;
  type: QuestionType;
  description: string;
  difficulty: DifficultyLevel;
  tags: string;

  // DSA Specific
  optimalSolution?: string;
  constraints?: string;
  testCases?: TestCaseForm[];

  // MCQ Specific
  options?: McqOptionForm[];
}

interface PhaseForm {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  materials: MaterialForm[];
  questions: QuestionForm[];
}

export default function CreateClass() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Class Details
  const [classTitle, setClassTitle] = useState("");
  const [classDescription, setClassDescription] = useState("");

  const [phases, setPhases] = useState<PhaseForm[]>([
    {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      isExpanded: true,
      materials: [],
      questions: [],
    },
  ]);

  // ==========================================
  // PHASE & MATERIAL HANDLERS (STEP 1)
  // ==========================================
  const addPhase = () =>
    setPhases([
      ...phases,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        isExpanded: true,
        materials: [],
        questions: [],
      },
    ]);
  const removePhase = (phaseId: string) =>
    setPhases(phases.filter((p) => p.id !== phaseId));
  const updatePhase = (phaseId: string, field: keyof PhaseForm, value: any) =>
    setPhases(
      phases.map((p) => (p.id === phaseId ? { ...p, [field]: value } : p)),
    );
  const togglePhaseExpansion = (phaseId: string) =>
    setPhases(
      phases.map((p) =>
        p.id === phaseId ? { ...p, isExpanded: !p.isExpanded } : p,
      ),
    );

  const addMaterial = (phaseId: string) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              isExpanded: true,
              materials: [
                ...p.materials,
                {
                  id: crypto.randomUUID(),
                  title: "",
                  type: "VIDEO",
                  content_url: "",
                },
              ],
            }
          : p,
      ),
    );
  };
  const removeMaterial = (phaseId: string, materialId: string) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? { ...p, materials: p.materials.filter((m) => m.id !== materialId) }
          : p,
      ),
    );
  };
  const updateMaterial = (
    phaseId: string,
    materialId: string,
    field: keyof MaterialForm,
    value: string,
  ) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              materials: p.materials.map((m) =>
                m.id === materialId ? { ...m, [field]: value } : m,
              ),
            }
          : p,
      ),
    );
  };

  // ==========================================
  // QUESTION & ASSESSMENT HANDLERS (STEP 2)
  // ==========================================
  const addQuestion = (phaseId: string, type: QuestionType) => {
    setPhases(
      phases.map((p) => {
        if (p.id === phaseId) {
          const newQuestion: QuestionForm = {
            id: crypto.randomUUID(),
            title: "",
            type,
            description: "",
            difficulty: "Medium",
            tags: "",
            ...(type === "DSA_QUESTION"
              ? { optimalSolution: "", constraints: "", testCases: [] }
              : {
                  options: [
                    { id: crypto.randomUUID(), text: "", isCorrect: true },
                  ],
                }),
          };
          return {
            ...p,
            isExpanded: true,
            questions: [...p.questions, newQuestion],
          };
        }
        return p;
      }),
    );
  };

  const updateQuestion = (
    phaseId: string,
    questionId: string,
    field: keyof QuestionForm,
    value: any,
  ) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q,
              ),
            }
          : p,
      ),
    );
  };
  const removeQuestion = (phaseId: string, questionId: string) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? { ...p, questions: p.questions.filter((q) => q.id !== questionId) }
          : p,
      ),
    );
  };

  // --- DSA Test Cases ---
  const addTestCase = (phaseId: string, questionId: string) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      testCases: [
                        ...(q.testCases || []),
                        {
                          id: crypto.randomUUID(),
                          input: "",
                          expectedOutput: "",
                          isSample: false,
                        },
                      ],
                    }
                  : q,
              ),
            }
          : p,
      ),
    );
  };
  const updateTestCase = (
    phaseId: string,
    questionId: string,
    tcId: string,
    field: keyof TestCaseForm,
    value: any,
  ) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      testCases: q.testCases?.map((tc) =>
                        tc.id === tcId ? { ...tc, [field]: value } : tc,
                      ),
                    }
                  : q,
              ),
            }
          : p,
      ),
    );
  };
  const removeTestCase = (
    phaseId: string,
    questionId: string,
    tcId: string,
  ) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      testCases: q.testCases?.filter((tc) => tc.id !== tcId),
                    }
                  : q,
              ),
            }
          : p,
      ),
    );
  };

  // --- MCQ Options ---
  const addOption = (phaseId: string, questionId: string) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: [
                        ...(q.options || []),
                        { id: crypto.randomUUID(), text: "", isCorrect: false },
                      ],
                    }
                  : q,
              ),
            }
          : p,
      ),
    );
  };
  const updateOptionText = (
    phaseId: string,
    questionId: string,
    optionId: string,
    text: string,
  ) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options?.map((opt) =>
                        opt.id === optionId ? { ...opt, text } : opt,
                      ),
                    }
                  : q,
              ),
            }
          : p,
      ),
    );
  };
  const setCorrectOption = (
    phaseId: string,
    questionId: string,
    correctOptionId: string,
  ) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options?.map((opt) => ({
                        ...opt,
                        isCorrect: opt.id === correctOptionId,
                      })),
                    }
                  : q,
              ),
            }
          : p,
      ),
    );
  };
  const removeOption = (
    phaseId: string,
    questionId: string,
    optionId: string,
  ) => {
    setPhases(
      phases.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options?.filter((opt) => opt.id !== optionId),
                    }
                  : q,
              ),
            }
          : p,
      ),
    );
  };

  // ==========================================
  // SUBMISSION
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: classTitle,
      description: classDescription,
      phases: phases.map((p, pIndex) => ({
        title: p.title,
        description: p.description,
        order_index: pIndex + 1,
        materials: p.materials.map((m, mIndex) => ({
          ...m,
          order_index: mIndex + 1,
        })),
        questions: p.questions,
      })),
    };

    try {
      // 1. Get the Auth Token
      const {
        data: { session },
        error: sessionError,
      } = await createClient().auth.getSession();
      if (sessionError || !session) throw new Error("You must be logged in.");

      // 2. Send the massive payload to FastAPI
      const response = await fetch("http://localhost:8000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to publish class");
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Course Builder
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {step === 1
                  ? "Step 1: Draft your curriculum and materials."
                  : "Step 2: Add assessments and challenges."}
              </p>
            </div>
            {step === 2 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Publish Class
              </button>
            )}
          </div>

          {/* ========================================================
              STEP 1: CLASS DETAILS & MATERIALS
          ======================================================== */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Class Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Class Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={classTitle}
                      onChange={(e) => setClassTitle(e.target.value)}
                      placeholder="e.g., Advanced System Design"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={classDescription}
                      onChange={(e) => setClassDescription(e.target.value)}
                      placeholder="What will students learn in this class?"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" /> Curriculum
                  Phases
                </h2>

                {phases.map((phase, pIndex) => (
                  <div
                    key={phase.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between group">
                      <div
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => togglePhaseExpansion(phase.id)}
                      >
                        <GripVertical className="w-5 h-5 text-gray-400 opacity-50 group-hover:opacity-100" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Phase {pIndex + 1}: {phase.title || "Untitled Phase"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => removePhase(phase.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePhaseExpansion(phase.id)}
                          className="p-1.5 text-gray-400"
                        >
                          {phase.isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {phase.isExpanded && (
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Phase Title
                            </label>
                            <input
                              type="text"
                              required
                              value={phase.title}
                              onChange={(e) =>
                                updatePhase(phase.id, "title", e.target.value)
                              }
                              placeholder="e.g., Introduction & Setup"
                              className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Phase Goal
                            </label>
                            <input
                              type="text"
                              value={phase.description}
                              onChange={(e) =>
                                updatePhase(
                                  phase.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Short description"
                              className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-3 pl-4 md:pl-8 border-l-2 border-gray-100 dark:border-gray-800">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Study Materials ({phase.materials.length})
                          </h4>
                          {phase.materials.map((material) => (
                            <div
                              key={material.id}
                              className="flex flex-col sm:flex-row gap-3 bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg border border-gray-200 dark:border-gray-800"
                            >
                              <select
                                value={material.type}
                                onChange={(e) =>
                                  updateMaterial(
                                    phase.id,
                                    material.id,
                                    "type",
                                    e.target.value,
                                  )
                                }
                                className="rounded border border-gray-300 dark:border-gray-700 bg-transparent text-sm py-1.5"
                              >
                                <option value="VIDEO">Video</option>
                                <option value="ARTICLE">Article</option>
                              </select>
                              <input
                                type="text"
                                required
                                placeholder="Material Title"
                                value={material.title}
                                onChange={(e) =>
                                  updateMaterial(
                                    phase.id,
                                    material.id,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                className="flex-1 w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1.5 text-sm"
                              />
                              <input
                                type="url"
                                placeholder="URL link to content"
                                value={material.content_url}
                                onChange={(e) =>
                                  updateMaterial(
                                    phase.id,
                                    material.id,
                                    "content_url",
                                    e.target.value,
                                  )
                                }
                                className="flex-1 w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1.5 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeMaterial(phase.id, material.id)
                                }
                                className="p-1.5 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addMaterial(phase.id)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
                          >
                            <Plus className="w-4 h-4" /> Add Material
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPhase}
                  className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 font-medium hover:text-blue-600 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add New Phase
                </button>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  Next: Add Assessments <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 2: ASSESSMENTS (DSA & MCQ)
          ======================================================== */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <h2 className="text-blue-800 dark:text-blue-300 font-semibold flex items-center gap-2">
                  <ListTodo className="w-5 h-5" /> Add Assessments to Phases
                </h2>
                <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                  Add challenges or quizzes to test student knowledge.
                </p>
              </div>

              {phases.map((phase, pIndex) => (
                <div
                  key={phase.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Phase {pIndex + 1}: {phase.title || "Untitled"}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => addQuestion(phase.id, "MCQ_QUESTION")}
                        className="text-xs px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        + Add MCQ
                      </button>
                      <button
                        type="button"
                        onClick={() => addQuestion(phase.id, "DSA_QUESTION")}
                        className="text-xs px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        + Add DSA
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-6">
                    {phase.questions.length === 0 && (
                      <p className="text-sm text-gray-500 italic text-center py-4">
                        No assessments added to this phase.
                      </p>
                    )}

                    {phase.questions.map((q) => (
                      <div
                        key={q.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 relative bg-white dark:bg-gray-950 shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => removeQuestion(phase.id, q.id)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2 mb-4">
                          {q.type === "DSA_QUESTION" ? (
                            <Code className="w-5 h-5 text-purple-500" />
                          ) : (
                            <ListTodo className="w-5 h-5 text-green-500" />
                          )}
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {q.type === "DSA_QUESTION"
                              ? "DSA Problem"
                              : "Multiple Choice Question"}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={q.title}
                              onChange={(e) =>
                                updateQuestion(
                                  phase.id,
                                  q.id,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1.5 text-sm"
                              placeholder="Question Title"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Difficulty
                            </label>
                            <select
                              value={q.difficulty}
                              onChange={(e) =>
                                updateQuestion(
                                  phase.id,
                                  q.id,
                                  "difficulty",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1.5 text-sm"
                            >
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Description (Markdown)
                            </label>
                            <textarea
                              rows={3}
                              value={q.description}
                              onChange={(e) =>
                                updateQuestion(
                                  phase.id,
                                  q.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1.5 text-sm font-mono"
                              placeholder="Write the question prompt..."
                            />
                          </div>
                        </div>

                        {/* DSA FIELDS */}
                        {q.type === "DSA_QUESTION" && (
                          <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Constraints
                                </label>
                                <textarea
                                  rows={2}
                                  value={q.constraints}
                                  onChange={(e) =>
                                    updateQuestion(
                                      phase.id,
                                      q.id,
                                      "constraints",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1.5 text-sm"
                                  placeholder="e.g. 1 <= N <= 10^5"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Optimal Solution (Hidden)
                                </label>
                                <textarea
                                  rows={2}
                                  value={q.optimalSolution}
                                  onChange={(e) =>
                                    updateQuestion(
                                      phase.id,
                                      q.id,
                                      "optimalSolution",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1.5 text-sm font-mono"
                                  placeholder="Paste solution code here"
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                                  Test Cases
                                </label>
                                <button
                                  type="button"
                                  onClick={() => addTestCase(phase.id, q.id)}
                                  className="text-xs font-medium text-blue-600"
                                >
                                  + Add Test Case
                                </button>
                              </div>
                              <div className="space-y-2">
                                {q.testCases?.map((tc) => (
                                  <div
                                    key={tc.id}
                                    className="flex items-start gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-800"
                                  >
                                    <div className="flex-1 space-y-2">
                                      <input
                                        type="text"
                                        placeholder="Input JSON (e.g. [1,2,3])"
                                        value={tc.input}
                                        onChange={(e) =>
                                          updateTestCase(
                                            phase.id,
                                            q.id,
                                            tc.id,
                                            "input",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full text-xs py-1 px-2 border rounded bg-white dark:bg-gray-950 font-mono"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Expected Output JSON"
                                        value={tc.expectedOutput}
                                        onChange={(e) =>
                                          updateTestCase(
                                            phase.id,
                                            q.id,
                                            tc.id,
                                            "expectedOutput",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full text-xs py-1 px-2 border rounded bg-white dark:bg-gray-950 font-mono"
                                      />
                                    </div>
                                    <div className="flex flex-col items-center gap-2 mt-1">
                                      <label className="text-[10px] text-gray-500 flex items-center gap-1 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={tc.isSample}
                                          onChange={(e) =>
                                            updateTestCase(
                                              phase.id,
                                              q.id,
                                              tc.id,
                                              "isSample",
                                              e.target.checked,
                                            )
                                          }
                                          className="rounded text-blue-600"
                                        />{" "}
                                        Sample?
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeTestCase(phase.id, q.id, tc.id)
                                        }
                                        className="text-gray-400 hover:text-red-500"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* MCQ FIELDS */}
                        {q.type === "MCQ_QUESTION" && (
                          <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                                Options
                              </label>
                              <button
                                type="button"
                                onClick={() => addOption(phase.id, q.id)}
                                className="text-xs font-medium text-blue-600"
                              >
                                + Add Option
                              </button>
                            </div>
                            <div className="space-y-2">
                              {q.options?.map((opt) => (
                                <div
                                  key={opt.id}
                                  className={`flex items-center gap-2 p-2 rounded border ${opt.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"}`}
                                >
                                  <input
                                    type="radio"
                                    name={`correct-${q.id}`}
                                    checked={opt.isCorrect}
                                    onChange={() =>
                                      setCorrectOption(phase.id, q.id, opt.id)
                                    }
                                    className="text-green-600 focus:ring-green-500 w-4 h-4"
                                    title="Mark as correct answer"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Option text"
                                    value={opt.text}
                                    onChange={(e) =>
                                      updateOptionText(
                                        phase.id,
                                        q.id,
                                        opt.id,
                                        e.target.value,
                                      )
                                    }
                                    className="flex-1 text-sm py-1 px-2 border-none bg-transparent focus:ring-0"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeOption(phase.id, q.id, opt.id)
                                    }
                                    className="text-gray-400 hover:text-red-500 p-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" /> Back to Curriculum
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
