// --- USER PROFILE MODELS ---

export interface LeftProfileCard {
  fullName: string;
  username: string;
  profileDesc?: string;
  graduationYear?: number;
  location?: string;
  website?: string;
  skills: string[];
}

// --- QUESTIONS & CODING MODELS ---

export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export type ProgrammingLanguage = 
  | "Python" 
  | "JavaScript" 
  | "TypeScript"
  | "Java" 
  | "C++" 
  | "C#"
  | "Go"
  | "Rust"
  | "Ruby"
  | "Swift"
  | "Kotlin";

export type QuestionTopic = 
  | "Array"
  | "String"
  | "Linked List"
  | "Tree"
  | "Graph"
  | "Dynamic Programming"
  | "Backtracking"
  | "Greedy"
  | "Binary Search"
  | "Sorting"
  | "Hash Table"
  | "Stack"
  | "Queue"
  | "Heap"
  | "Recursion"
  | "Math"
  | "Bit Manipulation";

export interface SolvedQuestion {
  id: number;
  title: string;
  difficulty: DifficultyLevel;
  topic: QuestionTopic;
  lang: ProgrammingLanguage;
  date: string;
  hintsUsed: number;
  runtime: string;
  memory: string;
  rank: string; // e.g., "Top 5%"
}

// --- PORTFOLIO & PROJECTS MODELS ---

export interface ProfessorFeedback {
  id: number;
  prof: string;
  course: string;
  date: string;
  comment: string;
}

export interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  stars?: number;
  language?: ProgrammingLanguage;
}

// --- ACADEMIC INFO MODELS ---

export interface AcademicInfo {
  university: string;
  degree: string;
  major?: string;
  gpa: string;
  expectedGraduation: string;
}

// --- CONTRIBUTION MODELS ---

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionData {
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface ContributionGrid {
  data: ContributionLevel[];
  totalContributions: number; // Sum of all contribution levels
}

// --- ACHIEVEMENT MODELS ---

export interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  icon?: string;
  type: "contest" | "milestone" | "streak" | "certification";
}

// --- EXTERNAL LINKS MODELS ---

export interface ExternalLink {
  id: number;
  platform: string;
  url: string;
  username?: string;
  icon?: string;
}

// --- CURRENT PROJECT MODELS ---

export interface CurrentProject {
  title: string;
  description: string;
  techStack?: string[];
  status?: "planning" | "in-progress" | "completed";
}

// --- STATISTICS MODELS ---

export interface CodingStatistics {
  totalQuestionsSolved: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  totalContests: number;
  globalRanking?: number;
  streakDays: number;
  languagesUsed: ProgrammingLanguage[];
}

// --- COMPLETE PROFILE PROPS ---

export interface ProfileProps {
  leftProfileCard: LeftProfileCard;
  contributionGrid: ContributionGrid;
  solvedQuestions: SolvedQuestion[];
  professorFeedback: ProfessorFeedback[];
  academicInfo?: AcademicInfo;
  portfolioProjects?: PortfolioProject[];
  currentProject?: CurrentProject;
  recentAchievement?: Achievement;
  externalLinks?: ExternalLink[];
  statistics?: CodingStatistics;
}

// --- HELPER TYPE FOR TAB NAMES ---

export type TabName = "Overview" | "Questions Solved" | "Portfolio";